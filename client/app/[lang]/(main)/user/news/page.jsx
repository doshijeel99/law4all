"use client";

import React, { useState, useEffect } from "react";
import { Globe, Clock, ExternalLink, Search, Loader } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES = [
  {
    id: "all",
    label: "All",
    searchTerms: [
      "cognitive development",
      "motor skills",
      "mental health games",
      "adaptive learning",
      "inclusive gaming",
    ],
  },
  {
    id: "cognitive",
    label: "Cognitive Development",
    searchTerms: [
      "brain training",
      "problem-solving",
      "memory exercises",
      "attention enhancement",
      "learning disabilities",
    ],
  },
  {
    id: "motor",
    label: "Motor Skills",
    searchTerms: [
      "hand-eye coordination",
      "fine motor training",
      "physical therapy",
      "movement exercises",
      "occupational therapy",
    ],
  },
  {
    id: "emotional",
    label: "Emotional Well-being",
    searchTerms: [
      "stress management",
      "emotional intelligence",
      "self-regulation",
      "mindfulness games",
      "psychological resilience",
    ],
  },
  {
    id: "social",
    label: "Social Interaction",
    searchTerms: [
      "peer engagement",
      "teamwork activities",
      "social inclusion",
      "communication skills",
      "group therapy",
    ],
  },
  {
    id: "skills",
    label: "Skills Training",
    searchTerms: [
      "life skills education",
      "adaptive learning",
      "career readiness",
      "independent living",
      "cognitive therapy",
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
      const searchTerms = category.searchTerms
        .map((term) => `"${term}"`)
        .join(" OR ");

      const contextTerms = "community OR development OR impact";

      const finalQuery = encodeURIComponent(
        `(${searchTerms}) AND (${contextTerms})`
      );

      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${finalQuery}&lang=en&country=in&max=10&sortby=relevance&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`
      );

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]);
      }

      const validArticles = (data.articles || []).filter(
        (article) =>
          article.title &&
          article.description &&
          article.url &&
          article.publishedAt
      );

      const uniqueArticles = Array.from(
        new Map(validArticles.map((article) => [article.url, article])).values()
      );

      setNews(uniqueArticles);
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
      console.error("Error fetching news:", err);
    } finally {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={dict?.news?.search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-purple-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory.id === category.id
                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {dict?.news?.[category.id]}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {dict?.news?.loading}
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={
                      article.image ||
                      "https://clunyfarm.co.za/news/what-is-mental-disability/@@download/image/Oct22_18_862457080.png"
                    }
                    alt={article.title}
                    className="object-cover w-full h-48"
                    onError={(e) => {
                      e.target.src =
                        "https://clunyfarm.co.za/news/what-is-mental-disability/@@download/image/Oct22_18_862457080.png";
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
                    className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500"
                  >
                    Read full article <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No news found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
