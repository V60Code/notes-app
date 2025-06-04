const extractPathnameSegments = (path) => {
  const trimmedPath = path.startsWith('/') ? path.substring(1) : path;
  const splitUrl = trimmedPath.split('/');
  
  return {
    resource: splitUrl[0] || null,
    id: splitUrl[1] || null,
  };
};

const matchRoute = (pathname, route) => {
  // Remove leading and trailing slashes
  const cleanPathname = pathname.replace(/^\/+|\/+$/g, '');
  const cleanRoute = route.replace(/^\/+|\/+$/g, '');

  const pathSegments = cleanPathname.split('/');
  const routeSegments = cleanRoute.split('/');

  // If segments length doesn't match, it's not a match
  if (pathSegments.length !== routeSegments.length) {
    return null;
  }

  const params = {};

  for (let i = 0; i < routeSegments.length; i++) {
    if (routeSegments[i].startsWith(':')) {
      // This is a parameter
      const paramName = routeSegments[i].substring(1);
      params[paramName] = pathSegments[i];
    } else if (routeSegments[i] !== pathSegments[i]) {
      // Static segments must match exactly
      return null;
    }
  }

  return params;
};

const findMatchingRoute = (pathname, routes) => {
  console.log('Finding route for pathname:', pathname);
  
  for (const [routePath, config] of Object.entries(routes)) {
    console.log('Checking route:', routePath);
    const params = matchRoute(pathname, routePath);
    
    if (params !== null) {
      console.log('Route matched:', routePath, 'with params:', params);
      return {
        route: config,
        params,
      };
    }
  }
  
  console.log('No matching route found');
  return {
    route: routes['/'],
    params: {},
  };
};

export const parseUrl = () => {
  const hash = window.location.hash;
  const pathname = hash.slice(1).replace(/^\/+|\/+$/g, ''); // Remove the '#' symbol and leading/trailing slashes
  return pathname;
};

export const parseActiveUrl = (routes) => {
  const url = parseUrl();
  console.log('Parsing URL:', url);
  return findMatchingRoute(url, routes);
};

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
