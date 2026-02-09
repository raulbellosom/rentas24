export const routes = {
  home: "/",
  properties: "/properties",
  propertyDetail: (id = ":id") => `/properties/${id}`,
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
  owner: "/owner",
  ownerProperties: "/owner/properties",
  ownerPropertyNew: "/owner/properties/new",
  ownerPropertyEdit: (id = ":id") => `/owner/properties/${id}/edit`,
  ownerPropertyView: (id = ":id") => `/owner/properties/${id}`,
  ownerProfile: "/owner/profile",
};

export const legacyRoutes = {
  myArticles: "/mis-articulos",
  announce: "/anuncio/:id",
  createArticle: "/crear-articulo",
  editArticle: "/editar-articulo/:id",
  viewArticle: "/ver-articulo/:id",
  article: "/article/:id",
  profile: "/perfil",
};
