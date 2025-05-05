import getBillboard from "@/actions/get-billboard";
import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";

export const revalidate = 0;

const HomePage = async () => {
  const products =await getProducts({isFeatured:true});
  const billboard = await getBillboard("9c9b08f0-54e4-4397-830d-b5f96e7e59e9");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard  data={billboard}/>
      
      <div className="flex flex-col gap-y-8 sm:px-6 lg:px-8">
      <ProductList title="Produits populaires" items={products}/>
      </div>
      </div>
    </Container>
  )
};

export default HomePage;