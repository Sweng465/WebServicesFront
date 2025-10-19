import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Router} from './general/Router.jsx';
import {Loading} from './components/Loading.jsx';
import {AuthProvider} from "./context/AuthProvider";

export const PageWithHeader = ({children}) => (
  <div className="flex h-full flex-col">{children}</div>
);

export const App = () => (
  
    <BrowserRouter>
    <AuthProvider>
      <Suspense
        fallback={
          <PageWithHeader>
            <Loading name="suspense"/>
          </PageWithHeader>
        }
      >
          <div className="h-full bg-indigo-50 p-4 lg:p-24">
            <Router/>
          </div>
      </Suspense>
      </AuthProvider>
    </BrowserRouter>
  
);
