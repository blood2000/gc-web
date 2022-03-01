<template>
 <div style="height: 100%">
   <plan-route-list v-if="viewType === 0"></plan-route-list>
   <planing-map :key="id" v-else></planing-map>
 </div>
</template>

<script>

import PlaningMap from "./PlanningMap";
import PlanRouteList from './list'
export default {
  components: {
    PlaningMap,
    PlanRouteList
  },
  data () {
    return {
      id: '',
      viewType: 0,
      routeCode: null,
    }
  },
  methods: {
    showAddRouteView () {
      this.routeCode = null
      this.viewType = 1
      this.id = `${new Date().getTime()}`
    },
    goBack() {
      this.viewType = 0
    },
    editPlanRoute (routeCode) {
      this.routeCode = routeCode
      this.viewType = 1
      this.id = `${new Date().getTime()}`
    }
  }
}
</script>
