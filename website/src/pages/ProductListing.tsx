import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  user_id: string;
}

interface PaginationResponse {
  data: Product[];
  current_page: number;
  last_page: number;
}

const ProductListing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { roles, hasRole } = useAuth();

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await API.get<PaginationResponse>(`/products?page=${page}`);
      setProducts(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to delete product. Please try again.",
          "error"
        );
        console.error("Delete error:", error);
      }
    }
  };

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      fetchProducts(page);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        {roles?.some((role) => role.name === "Admin") && (
          <Link
            to="/products/create"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Add New Product
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found.</p>
          <Link to="/products/create" className="text-blue-500 hover:underline">
            Create your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      {(hasRole("Admin") ||
                        product.user_id ===
                          localStorage.getItem("user_id")) && (
                        <>
                          <Link
                            to={`/products/${product.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListing;