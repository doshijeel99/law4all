"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DocumentCard from "@/components/Document/DocumentCard";
import DocumentPreview from "@/components/Document/DocumentPreview";
import { Loader2, Search } from "lucide-react";

export default function DocumentSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(document);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a document name to search");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDocument(null);

      const response = await fetch(`http://127.0.0.1:8000/get-documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const data = await response.json();

      if (data.documents) {
        const url = data.documents[0];

        // Extract filename from URL
        const filename = url.split("/").pop();
        // Remove file extension
        const title = filename.split(".")[0].replace(/-/g, " ");
        // Extract category from URL path
        const pathParts = url.split("/");
        const category = pathParts[pathParts.length - 2] || "Uncategorized";

        const transformedDoc = {
          id: `doc-search-result`,
          title: formatTitle(title),
          description: `${formatTitle(title)} document`,
          category: formatTitle(category),
          url: url,
          fileType: getFileType(url),
        };

        setDocument(transformedDoc);
      } else {
        setError("No document found matching your search query");
      }
    } catch (err) {
      setError("Failed to search for document. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format titles
  const formatTitle = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to get file type from URL
  const getFileType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    return extension;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Document Search</CardTitle>
          <CardDescription>
            Enter a document name to search in our legal document library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="w-full md:flex-grow">
              <Input
                type="text"
                placeholder="Search for documents (e.g., adoption-deed, power-of-attorney)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {document && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Search Result</h2>
            <DocumentCard
              key={document.id}
              document={document}
              onClick={() => {
                if (document.url) {
                  window.open(document.url, "_blank");
                } else {
                  router.push(`/en/docs/${document.id}`);
                }
              }}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Document Preview</h2>
            <DocumentPreview document={document} />
          </div>
        </div>
      )}

      {!loading && !document && !error && (
        <Card className="bg-gray-50">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">
              Enter a document name above to search in our legal document
              library
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching for common legal documents like "adoption-deed",
              "power-of-attorney", etc.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
