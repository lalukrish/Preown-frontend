import axios from "axios";

export async function getAllProducts() {
  try {
    const res = await axios.get(
      //  "https://api.iclc.org.in/api/articles/fethcAll?populate=*&sort[0]=posted_at:desc",
      //&sort[1]=updatedAt:desc"
      "http://backapp.preown.store/api/new-products",
    );
    return res?.data?.data ?? [];
  } catch (err) {
    return "";
  }
}

export async function getArticleBySlug(slug) {
  try {
    const res = await axios.get(
      `https://api.iclc.org.in/api/articles/slug/${slug}`,
    );
    return res?.data;
  } catch (err) {
    return "";
  }
}
