import { Route, Routes } from "react-router-dom";

import { RoutePaths } from "./RoutePaths.jsx";
//import { Home } from "../home/Home.jsx";
import { Homepage } from "../pages/Homepage.jsx";
import { SignIn } from "../pages/SignIn.jsx";
import { SignUp } from "../pages/SignUp.jsx";
import { NotFound } from "./NotFound.jsx";
import { Layout } from "./Layout.jsx";

export const Router = () => (
  <Routes>
    <Route
      path={RoutePaths.HOMEPAGE}
      element={
        <Layout>
          <Homepage />
        </Layout>
      }
    />
    <Route
      path={RoutePaths.SIGNIN}
      element={
        <Layout>
          <SignIn />
        </Layout>
      }
    />
    <Route
      path={RoutePaths.SIGNUP}
      element={
        <Layout>
          <SignUp />
        </Layout>
      }
    />
    <Route
      path="*"
      element={
        <Layout>
          <NotFound />
        </Layout>
      }
    />
  </Routes>
);
