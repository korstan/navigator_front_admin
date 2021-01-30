import AllBuildings from '../views/AllBuildings';
import BuildingInfo from '../views/BuildingInfo';
import AllPaths from '../views/AllPaths';
import PathsBuilding from '../views/PathsBuilding';
import HelloWorld from '../components/HelloWorld';

const Bar = { template: '<div>bar</div>' };

export default [
  { path: '/', component: AllBuildings },
  {
    path: '/building/:id',
    component: BuildingInfo,
    props(route) {
      return { title: route.query.title, buildingId: route.params.id };
    },
  },
  { 
    path: '/paths',
    component: AllPaths,
  },
  { 
    path: '/paths/:id',
    component: PathsBuilding,
    props(route) {
      return { title: route.query.title };
    },
  },
  { path: '/foo', component: HelloWorld },
  { path: '/bar', component: Bar },
];
