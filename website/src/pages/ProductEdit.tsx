import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import notify from "../utils/toastUtils";

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
}

interface Errors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  general?: string;
}

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await API.get<Product>(`/products/${id}`);
        const product = productResponse.data;

        setFormData({
          name: product?.name,
          description: product?.description,
          price: product?.price?.toString(),
          stock: product?.stock?.toString(),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({
          general: "Failed to load product data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof Errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock quantity is required";
    } else if (
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Stock must be a non-negative integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await API.put(`/products/${id}`, productData);

      notify.success("Product Updated Successfully");
      navigate("/products");
    } catch (error: any) {
      console.error("Error updating product:", error);

      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general:
            error.response?.data?.message ||
            "Failed to update product. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 outline-blue-500 p-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.name ? "border-red-300" : "border-gray-300"
              } focus:outline-blue-500 p-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.price ? "border-red-300" : "border-gray-300"
              } focus:outline-blue-500 p-2 focus:ring-blue-500`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.stock ? "border-red-300" : "border-gray-300"
              } focus:outline-blue-500 p-2 focus:ring-blue-500`}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.description ? "border-red-300" : "border-gray-300"
              } focus:outline-blue-500 p-2 focus:ring-blue-500`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
