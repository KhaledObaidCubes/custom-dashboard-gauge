<template>
  <span subtle :accent="'primary'" class="tile tile-circle text-primary">{{ strt }}</span>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { props } from './animated-counter'
import { Easing, EasingFunction, EasingGenerator, animate } from 'motion'

const { finalValue, ease = 'ease-in', duration = 0.5 } = defineProps(props)
const strt = ref(0)
const timeoutId = ref()
onMounted(() => {
  timeoutId.value = setTimeout(
    () => {
      if (finalValue) animate(progress => (strt.value = Math.round(progress * finalValue)), { duration: duration, easing: ease as EasingGenerator | Easing | Easing[] | EasingFunction | undefined })
    },
    1000,
    whenSetTimeOutComplete()
  )
})

const whenSetTimeOutComplete = () => {
  clearTimeout(timeoutId.value)
}
</script>
