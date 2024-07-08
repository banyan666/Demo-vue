<template>
  <div style="width: 15%;height: 100%">
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        class="menu"
        @select="selectMenu"
    >
      <el-menu-item v-for="item in route[0].children" :index="item.path" :key="item.path">{{item.name}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import route from '../../router/route.ts'
const router = useRouter()
const selectMenu = (index,indexPath, item,routeResult) =>{
  console.log(index,indexPath, item,routeResult)
  router.push(index)
}

</script>

<style scoped>
.menu{
  height: 100%;
}
</style>