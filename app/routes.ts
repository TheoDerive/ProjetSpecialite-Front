import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login" ,"routes/login.tsx"),
  route("signin" ,"routes/signin.tsx"),
  route("user" ,"routes/about.tsx"),
  route("admin" ,"routes/adminAnalistics.tsx"),
] satisfies RouteConfig;
