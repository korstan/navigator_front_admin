import AllBuildings from '../views/AllBuildings';
import BuildingInfo from '../views/BuildingInfo';
import HelloWorld from '../components/HelloWorld';

const Bar = { template: '<div>bar</div>' };

export default [
  { path: '/', component: AllBuildings },
  {
    path: '/building/:id',
    component: BuildingInfo,
    props(route) {
      return { title: route.query.title };
    },
  },
  { path: '/foo', component: HelloWorld },
  { path: '/bar', component: Bar },
];
