"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Globe, Clock, ExternalLink, Search, Loader } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES = [
  {
    id: "all",
    label: "All",
    searchTerms: [
      "AI legal aid",
      "justice accessibility",
      "underserved communities legal services",
      "technology access to justice",
      "legal tech innovation",
    ],
  },
  {
    id: "aiLegal",
    label: "AI Legal Tools",
    searchTerms: [
      "artificial intelligence legal services",
      "machine learning legal aid",
      "automated legal assisbluece",
      "legal chatbots",
      "predictive legal analytics",
      "AI document review",
      "smart legal contracts",
    ],
  },
  {
    id: "accessJustice",
    label: "Access to Justice",
    searchTerms: [
      "legal access gap",
      "justice divide",
      "equitable legal representation",
      "legal deserts",
      "affordable legal help",
      "justice accessibility barriers",
      "legal system navigation",
    ],
  },
  {
    id: "underserved",
    label: "Underserved Communities",
    searchTerms: [
      "rural justice access",
      "marginalized communities legal aid",
      "low-income legal services",
      "indigenous legal rights",
      "disability legal advocacy",
      "immigrant legal assisbluece",
      "language barriers legal system",
    ],
  },
  {
    id: "innovation",
    label: "Legal Innovation",
    searchTerms: [
      "legal tech startups",
      "justice tech innovations",
      "digital transformation law",
      "community legal clinics technology",
      "virtual legal services",
      "mobile legal applications",
      "remote legal assisbluece",
    ],
  },
  {
    id: "impact",
    label: "Social Impact",
    searchTerms: [
      "community legal empowerment",
      "legal literacy programs",
      "legal advocacy outcomes",
      "access to justice impact",
      "tech justice initiatives",
      "legal aid effectiveness",
      "social justice technology",
    ],
  },
  {
    id: "policy",
    label: "Policy & Regulation",
    searchTerms: [
      "legal aid funding policy",
      "justice technology regulation",
      "government legal innovation",
      "public legal education policy",
      "justice reform technology",
      "legal services regulation",
      "digital justice policy",
    ],
  },
  {
    id: "education",
    label: "Legal Education",
    searchTerms: [
      "community legal education",
      "know your rights technology",
      "digital legal literacy",
      "self-help legal resources",
      "legal education accessibility",
      "public legal information",
      "legal empowerment tools",
    ],
  },
  {
    id: "partnerships",
    label: "Partnerships",
    searchTerms: [
      "public-private legal partnerships",
      "tech legal aid collaboration",
      "university legal clinic innovations",
      "corporate pro bono technology",
      "nonprofit legal tech alliances",
      "community legal partnerships",
      "cross-sector justice initiatives",
    ],
  },
];

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { dict } = useLanguage();

  const fetchNews = async (category) => {
    setLoading(true);
    setError("");
  
    try {
      // Construct search terms (limit to the first 3 terms)
      const searchTerms = category.searchTerms
        .slice(0, 3)
        .map((term) => `"${term}"`)
        .join(" OR ");
  
      // Construct and encode the final query
      let finalQuery = encodeURIComponent(
        `(${searchTerms} AND (legal OR justice OR law))`
      );
  
      // Fallback query if no articles are found
      const fallbackQuery = encodeURIComponent("legal OR justice OR law");
  
      // Log the API URL for debugging
      const apiUrl = `https://gnews.io/api/v4/search?q=${finalQuery}&lang=en&country=us&max=10&sortby=relevance&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`;
      console.log("API URL:", apiUrl);
  
      // Make the API request using Axios
      let response = await axios.get(apiUrl);
  
      // If no articles are found, try the fallback query
      if (response.data.articles.length === 0) {
        console.log("No articles found. Trying fallback query...");
        const fallbackApiUrl = `https://gnews.io/api/v4/search?q=${fallbackQuery}&lang=en&country=us&max=10&sortby=relevance&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`;
        response = await axios.get(fallbackApiUrl);
      }
  
      // Log the API response for debugging
      console.log("API Response:", response.data);
  
      // Filter valid articles
      const validArticles = (response.data.articles || []).filter(
        (article) =>
          article.title &&
          article.description &&
          article.url &&
          article.publishedAt
      );
  
      // Remove duplicate articles based on URL
      const uniqueArticles = Array.from(
        new Map(validArticles.map((article) => [article.url, article])).values()
      );
  
      // Update state with the fetched news
      setNews(uniqueArticles);
    } catch (err) {
      // Handle errors
      setError("Failed to fetch news. Please try again later.");
      console.error("Error fetching news:", err.message || err);
  
      // Log additional details if available
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <div className="h-full dark:bg-gray-900 py-2 overflow-y-scroll pr-2">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  dict?.news?.search_placeholder ||
                  "Search AI legal aid news..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory.id === category.id
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {dict?.news?.[category.id] || category.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {dict?.news?.loading || "Loading latest legal innovation news..."}
            </span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredNews.map((article, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={
                      article.image ||
                      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2942&q=80"
                    }
                    alt={article.title}
                    className="object-cover w-full h-48"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2942&q=80";
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {article.source.name}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                  >
                    Read full article <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              We couldn't find any news matching your search criteria. Try
              adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
