import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const toast = useToast();

  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
    }
    setNewProduct({ name: "", price: "", image: "" });
  };

  return (
    <div className="max-w-screen-sm mx-auto">
      <div className="flex flex-col space-y-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-blue-500 dark:text-yellow-50">
          Create New Product
        </h1>

        <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col space-y-4">
            <input
              className="p-2 border text-black border-gray-300 rounded  bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              className="p-2 border text-black  bg-gray-300  border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              className="p-2 border text-black  bg-gray-300  border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
