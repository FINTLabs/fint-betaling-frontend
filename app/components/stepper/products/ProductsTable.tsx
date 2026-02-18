import {Box, Checkbox, Heading, HStack, Search, Table, TextField, VStack,} from "@navikt/ds-react";
import {useMemo} from "react";
import type {ILineItem, ISelectedProduct} from "~/types/product";
import {formatCurrency} from "~/utils/variousFormats";

interface ProductsTableProps {
  products: ILineItem[];
  selectedProducts: ISelectedProduct[];
  onToggleProduct: (product: ILineItem, checked: boolean) => void;
  onQuantityChange: (product: ILineItem, quantity: number) => void;
  onPriceChange: (product: ILineItem, price: number) => void;
  onFreeTextChange: (product: ILineItem, freeText: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ProductsTable({
  products,
  selectedProducts,
  onToggleProduct,
  onQuantityChange,
  onPriceChange,
  onFreeTextChange,
  searchQuery,
  onSearchChange,
}: ProductsTableProps) {

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.description.toLowerCase().includes(query) ||
        product.itemCode.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  const getSelectedProduct = (
    itemCode: string,
  ): ISelectedProduct | undefined => {
    return selectedProducts.find((p) => p.itemCode === itemCode);
  };

  const getQuantity = (itemCode: string): number => {
    const selected = getSelectedProduct(itemCode);
    return selected?.quantity || 1;
  };

  const getPrice = (product: ILineItem): number => {
    const selected = getSelectedProduct(product.itemCode);
    // Use custom price if set, otherwise use original price
    return selected?.customPrice !== undefined
      ? selected.customPrice
      : product.itemPrice;
  };

  const calculateNetSum = (product: ILineItem): number => {
    const quantity = getQuantity(product.itemCode);
    const price = getPrice(product);
    return price * quantity;
  };


  // TODO: change to aksel search
  return (
    // <Box
    //   padding="space-6"
    //   // background="surface-default"
    //   borderRadius="12"
    //   borderWidth="1"
    //   // borderColor="border-subtle"
    // >
      <VStack gap="space-6">
        <Box>
          <Heading size="small" level="4" spacing>
            Tilgjengelige produkter ({filteredProducts.length})
          </Heading>
        </Box>

        {/* Search Section */}
        <Box
          // padding="space-4"
          // // background="surface-subtle"
          // borderRadius="12"
          // borderWidth="1"
          // borderColor="brand-magenta-subtle"
        >
          <Search label="Søk på produktnavn eller produktkode" variant="secondary" size="small" onChange={(value) => onSearchChange(value)}/>

          {/*<TextField*/}
          {/*    size="small"*/}
          {/*  label="Søk på produktnavn eller produktkode"*/}
          {/*  value={searchQuery}*/}
          {/*  onChange={(e) => onSearchChange(e.target.value)}*/}
          {/*  placeholder="Søk "*/}
          {/*/>*/}
        </Box>

        {filteredProducts.length === 0 ? (
          <Box
            paddingBlock="space-8"
            paddingInline="space-4"
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                color: "var(--a-text-subtle)",
                margin: 0,
                fontSize: "0.875rem",
              }}
            >
              {searchQuery
                ? "Ingen resultater funnet for søket ditt"
                : "Ingen produkter tilgjengelig"}
            </p>
          </Box>
        ) : (
          <Box>
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Velg</Table.HeaderCell>
                  <Table.HeaderCell>Navn</Table.HeaderCell>
                  <Table.HeaderCell>Fritekst</Table.HeaderCell>
                  <Table.HeaderCell>Kode</Table.HeaderCell>
                  <Table.HeaderCell>Mva</Table.HeaderCell>
                  <Table.HeaderCell>Netto pris pr. enhet</Table.HeaderCell>
                  <Table.HeaderCell>Antall</Table.HeaderCell>
                  <Table.HeaderCell>Netto sum</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p.itemCode === product.itemCode,
                  );
                  const quantity = getQuantity(product.itemCode);
                  const netSum = calculateNetSum(product);

                  return (
                    <Table.Row key={product.itemCode} selected={isSelected}>
                      <Table.DataCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleProduct(product, !isSelected)}
                          hideLabel
                        >
                          Velg {product.description}
                        </Checkbox>
                      </Table.DataCell>
                      <Table.DataCell>{product.description}</Table.DataCell>
                      <Table.DataCell>
                        {isSelected && (
                          <TextField
                            label="Fritekst"
                            value={
                              getSelectedProduct(product.itemCode)?.freeText ||
                              ""
                            }
                            onChange={(e) =>
                              onFreeTextChange(product, e.target.value)
                            }
                            hideLabel
                            size="small"
                          />
                        )}
                      </Table.DataCell>
                      <Table.DataCell>{product.itemCode}</Table.DataCell>
                      <Table.DataCell>
                        {product.taxrate
                          ? `${(product.taxrate / 10).toString()}%`
                          : "-"}
                      </Table.DataCell>
                      <Table.DataCell
                        width="200px"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {isSelected ? (
                          <HStack gap="space-2" align="center">
                            <TextField
                              label="Kroner"
                              type="number"
                              min={0}
                              value={Math.floor(
                                getPrice(product) / 100,
                              ).toString()}
                              onChange={(e) => {
                                const kroner = parseInt(e.target.value) || 0;
                                const selected = getSelectedProduct(
                                  product.itemCode,
                                );
                                const ore =
                                  selected?.customPrice !== undefined
                                    ? getPrice(product) % 100
                                    : product.itemPrice % 100;
                                const priceInOre = kroner * 100 + ore;
                                onPriceChange(product, priceInOre);
                              }}
                              hideLabel
                              size="small"
                              style={{ width: "80px" }}
                            />
                            <span>|</span>
                            <TextField
                              label="Øre"
                              type="number"
                              min={0}
                              max={99}
                              value={(getPrice(product) % 100)
                                .toString()
                                .padStart(2, "0")}
                              onChange={(e) => {
                                const ore = Math.min(
                                  99,
                                  Math.max(0, parseInt(e.target.value) || 0),
                                );
                                const kroner = Math.floor(
                                  getPrice(product) / 100,
                                );
                                const priceInOre = kroner * 100 + ore;
                                onPriceChange(product, priceInOre);
                              }}
                              hideLabel
                              size="small"
                              style={{ width: "60px" }}
                            />
                          </HStack>
                        ) : (
                          formatCurrency(product.itemPrice)
                        )}
                      </Table.DataCell>
                      <Table.DataCell style={{ whiteSpace: "nowrap" }}>
                        {isSelected ? (
                          <TextField
                            label="Antall"
                            type="number"
                            min={1}
                            value={quantity.toString()}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              onQuantityChange(
                                product,
                                Math.max(1, newQuantity),
                              );
                            }}
                            hideLabel
                            size="small"
                            style={{ width: "80px" }}
                          />
                        ) : (
                          "1"
                        )}
                      </Table.DataCell>
                      <Table.DataCell style={{ whiteSpace: "nowrap" }}>
                        {formatCurrency(netSum)}
                      </Table.DataCell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Box>
        )}
      </VStack>
    // </Box>
  );
}
