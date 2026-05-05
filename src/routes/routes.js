const RoutesCentral = {};
RoutesCentral.routes = [];

RoutesCentral.generateRoutes = (express) => {
  loadRoutes();
  for (index in RoutesCentral.routes) {
    let name = RoutesCentral.routes[index].name;
    let route = RoutesCentral.routes[index].route;

    express.use(name, route);
  }

  return express;
};

const loadRoutes = () => {
  RoutesCentral.routes.push(
    generateRouteObject('/', require('./index')),
  );
};

const generateRouteObject = (routeName, route) => {
  return {
    name: routeName,
    route: route,
  };
};

module.exports = RoutesCentral;
