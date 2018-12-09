// https://github.com/pillarjs/path-to-regexp
import pathToRegExp from "path-to-regexp";

export async function catchRoute(component) {
    // Get the current path and the the paths setup in ion-router 
    const path = window.location.pathname;
    const routes = await getRoutes();

    // Setup var to pass boolean to path_found if current path is valid or not
    let found = false;

    // If a path doesnt match exactly then we need to check with regex because of url :name tokens
    if (!routes.includes(path)) {

      for (var i = 0; i < routes.length; i++) {

        var keys = [];
        var re = pathToRegExp(routes[i], keys);
        var regex = re.exec(path);

        if (regex === null) {
          console.log("not found", path);
          found = true;
        } else {
          console.log("found", path);
          found = false;
          break;
        }

      }

      if ( found ) {
        const nav = document.getElementsByTagName('ion-nav');

        nav[0].componentOnReady().then(nav => {
          nav.setRoot(component, {});
        });
      }


    }
}

  // Returns the route path urls from ion-router html
  export async function getRoutes() {

    const router = await document.getElementsByTagName('ion-router');

    return (Array.from(router[0].children) as HTMLIonRouteElement[])
      .filter(el => el.tagName === "ION-ROUTE" && el.component)
      .map(el => {
        return el.url;
      });
  }