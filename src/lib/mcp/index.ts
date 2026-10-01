import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServices from "./tools/list-services";
import listProducts from "./tools/list-products";
import searchInsights from "./tools/search-insights";
import latestNews from "./tools/latest-news";
import listClients from "./tools/list-clients";
import getArticle from "./tools/get-article";
import upsertInsight from "./tools/upsert-insight";
import upsertNews from "./tools/upsert-news";
import uploadImage from "./tools/upload-image";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "difvvdmelbtjxxvpjuvw";

export default defineMcp({
  name: "advisable-mcp",
  title: "Advisable",
  version: "0.2.0",
  instructions:
    "Tools for the Advisable website. Read: services, products, clients, latest news and insights/blog articles. Write (admin accounts only): create or update insights and news articles per language with HTML content, and upload images to storage. Typical publishing flow: upload_image -> upsert_insight (or upsert_news) with the returned URL as featured_image and inside the HTML content. Use get_article first when editing existing content.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listServices,
    listProducts,
    searchInsights,
    latestNews,
    listClients,
    getArticle,
    upsertInsight,
    upsertNews,
    uploadImage,
  ],
});
