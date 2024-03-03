//@ts-nocheck
const services = require.context(
  // Look for files in the current directory
  '.',
  //  look in subdirectories
  true,
  // Only include .ts files
  /\.(service|repo)\.ts$/
)

import { serviceMap as cubesServiceMap } from 'cubes-app'
import { serviceMap as dashboardServiceMap } from 'cubes-dashboard'
import { repositoryMap as dashboardRepositoryMap } from 'cubes-dashboard'

const serviceMap = {
  ...cubesServiceMap,
  ...dashboardServiceMap
}
const repositoryMap = {
  ...dashboardRepositoryMap
}
type TADAFSACustomServiceMap = typeof serviceMap
export { services, serviceMap, repositoryMap }
export type { TADAFSACustomServiceMap }
