import React, { useEffect, useState, useCallback } from 'react';
import { Page, Layout, Card, IndexTable, Thumbnail, Text, TextField, Spinner, EmptyState, useIndexResourceState } from '@shopify/polaris';
import { SearchIcon, ImageIcon } from '@shopify/polaris-icons';
import { BACKEND_URL } from '../config';

const ProductPage = ({ onSelectProduct, shopName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async (query = "") => {
    setLoading(true);
    if (!shopName) return;

    try {
      let url = `${BACKEND_URL}/api/products?shop=${shopName}`;
      if (query) url += `&search=${encodeURIComponent(query)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) { console.error("Fetch failed:", err); } 
    finally { setLoading(false); }
  }, [shopName]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchProducts(searchTerm), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProducts]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(products);

  const rowMarkup = products.map(
    ({ id, title, image, images, variants }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        onClick={() => onSelectProduct(id)} // 🟢 THIS CLICK OPENS DETAILS
      >
        <IndexTable.Cell>
          <Thumbnail source={image ? image.src : (images && images[0] ? images[0].src : ImageIcon)} alt={title} size="small" />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
           {variants && variants[0] ? `PKR ${variants[0].price}` : '—'}
        </IndexTable.Cell>
        <IndexTable.Cell>
           <Text tone="success">Active</Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page title="Your Products" fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '16px' }}>
              <TextField
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search products..."
                prefix={<SearchIcon />}
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchTerm("")}
              />
            </div>
            {loading ? <div style={{padding:'20px'}}><Spinner /></div> : 
             products.length === 0 ? <EmptyState heading="No products found" image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"><p>Try changing search.</p></EmptyState> :
             <IndexTable
                resourceName={{ singular: 'product', plural: 'products' }}
                itemCount={products.length}
                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[{ title: 'Image' }, { title: 'Product Title' }, { title: 'Price' }, { title: 'Status' }]}
                selectable={false}
             >
                {rowMarkup}
             </IndexTable>
            }
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductPage;