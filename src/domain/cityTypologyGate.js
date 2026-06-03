export const CITY_TYPOLOGY = {
  CONCENTRATED_WALKABLE: 'concentrated_walkable',
  POLYCENTRIC_WALKABLE: 'polycentric_walkable',
  DISPERSED_CAR_DEPENDENT: 'dispersed_car_dependent',
}

export const CAR_DEPENDENT_TRANSPORT_CAP = 0.07

export function isCarDependent(cityTypology) {
  return cityTypology === CITY_TYPOLOGY.DISPERSED_CAR_DEPENDENT
}
