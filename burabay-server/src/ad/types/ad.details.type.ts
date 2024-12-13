export interface IChillDetails {
  type: 'chillPlace';
  equippedBeach: boolean | null;
  wildBeach: boolean | null;
  restingCanopy: boolean | null;
  barbecueArea: boolean | null;
  tablesAndBenches: boolean | null;
  barbecueZone: boolean | null;
  waterAccessArea: boolean | null;
  tennisCourts: boolean | null;
  footballField: boolean | null;
  golfCourse: boolean | null;
  beachVolleyball: boolean | null;
  childrensPlayground: boolean | null;
  ropePark: boolean | null;
  routeWithSignposts: boolean | null;
  mountainTrail: boolean | null;
  forestTrail: boolean | null;
  wildlifeObservationArea: boolean | null;
  fishingSpot: boolean | null;
  huntingSpot: boolean | null;
  mushroomPickingArea: boolean | null;
  berryPickingArea: boolean | null;
  equippedCampingSite: boolean | null;
  wildCampingSite: boolean | null;
  winterFishing: boolean | null;
}

export interface ILivingPlaceDetails {
  type: 'livingPlace';
  freeWiFi: boolean | null;
  privateParking: boolean | null;
  breakfastIncluded: boolean | null;
  dailyCleaning: boolean | null;
  airConditioning: boolean | null;
  refrigerator: boolean | null;
  television: boolean | null;
  kettle: boolean | null;
  heating: boolean | null;
  receptionAnd24HourService: boolean | null;
  onSitePool: boolean | null;
  onSiteSauna: boolean | null;
  spaZone: boolean | null;
  directAccessToNature: boolean | null;
  onSiteBonfireZones: boolean | null;
  excursionProgramsAndTours: boolean | null;
  onSiteEntertainmentActivities: boolean | null;
  onSiteChildrenPlayArea: boolean | null;
  onSiteRestaurantAndBar: boolean | null;
  laundryAndDryCleaningServices: boolean | null;
  washingMachine: boolean | null;
  iron: boolean | null;
  waterView: boolean | null;
  forestView: boolean | null;
  gardensAndFlowerbeds: boolean | null;
  kitchenUtensilsPlatesCupsCutlery: boolean | null;
  equippedPrivateKitchen: boolean | null;
  equippedSharedKitchen: boolean | null;
  fireplace: boolean | null;
  gymAndFitnessCenter: boolean | null;
  medicalTreatments: boolean | null;
  onSiteConferenceRoom: boolean | null;
}

export interface IFoodDetails {
  type: 'food';
  europeanCuisine: boolean | null;
  easternCuisine: boolean | null;
  kidsMenu: boolean | null;
  vegetarianDishes: boolean | null;
  glutenAndLactoseFreeDishes: boolean | null;
  dietaryMenu: boolean | null;
  freshAndOrganicFood: boolean | null;
  kazakhNationalCuisine: boolean | null;
  italianCuisine: boolean | null;
  japaneseCuisine: boolean | null;
  detoxCocktails: boolean | null;
  sportsNutrition: boolean | null;
  wineList: boolean | null;
  outdoorSeatingTerraces: boolean | null;
  privateParking: boolean | null;
  liveMusic: boolean | null;
}

export interface IAttractionsDetails {
  type: 'attractions';
  historicalPlace: boolean | null;
  museum: boolean | null;
  naturalMonument: boolean | null;
  observationArea: boolean | null;
  park: boolean | null;
  monument: boolean | null;
  sculpture: boolean | null;
  castle: boolean | null;
  fortress: boolean | null;
  archaeologicalSite: boolean | null;
  resortSightseeingTour: boolean | null;
  abylaiKhanGladeTour: boolean | null;
  bolektauMountainHike: boolean | null;
  okzhetpesMountainHike: boolean | null;
  kokchetauMountainHike: boolean | null;
  excursion: boolean | null;
  busTours: boolean | null;
}

export interface IHealthDetails {
  type: 'health';
  bodyWrap: boolean | null;
  peeling: boolean | null;
  sauna: boolean | null;
  steamBathWithAttendant: boolean | null;
  hydroMassageAndJacuzzi: boolean | null;
  mineralWaterPool: boolean | null;
  mudBath: boolean | null;
  mineralBath: boolean | null;
  aromatherapy: boolean | null;
  classicMassage: boolean | null;
  thaiMassage: boolean | null;
  professionalWellnessMassage: boolean | null;
  meditationSession: boolean | null;
  yogaClass: boolean | null;
  facialCare: boolean | null;
  bodyCare: boolean | null;
  hairCare: boolean | null;
  nailCare: boolean | null;
  hydroMassagePool: boolean | null;
  charcotShower: boolean | null;
  saltRoom: boolean | null;
  thermalSpring: boolean | null;
  rehabilitationProgram: boolean | null;
  fitnessClassWithTrainer: boolean | null;
  cardioTraining: boolean | null;
  pilates: boolean | null;
  relaxationAndRecreationArea: boolean | null;
  inhalationProcedure: boolean | null;
  cosmeticProcedure: boolean | null;
  rejuvenationProgram: boolean | null;
  hammockAndLoungerZone: boolean | null;
  teaCeremony: boolean | null;
  quietZoneWithBackgroundMusic: boolean | null;
  martialArtsClass: boolean | null;
  specialDetoxProgram: boolean | null;
  musculoskeletalSystemProgram: boolean | null;
  mudCosmeticProcedure: boolean | null;
  therapeuticSwimming: boolean | null;
  jointTherapyApplication: boolean | null;
  turkishHammam: boolean | null;
  privateSpaRoom: boolean | null;
  groupMeditationSession: boolean | null;
  relaxationMassage: boolean | null;
  mineralSprings: boolean | null;
  russianBath: boolean | null;
  finnishBath: boolean | null;
  turkishBath: boolean | null;
  yogaHall: boolean | null;
  massageSalon: boolean | null;
  therapeuticProgram: boolean | null;
}

export interface IEntertainmentDetails {
  type: 'entertainment';
  amusementPark: boolean | null;
  waterPark: boolean | null;
  zoo: boolean | null;
  pettingZoo: boolean | null;
  goKarting: boolean | null;
  bowling: boolean | null;
  disco: boolean | null;
  karaoke: boolean | null;
  party: boolean | null;
  show: boolean | null;
  concert: boolean | null;
  celebration: boolean | null;
  culturalEvent: boolean | null;
  souvenirShop: boolean | null;
  souvenirAndLocalCraftShops: boolean | null;
  pontoonBoatWaterTours: boolean | null;
  attractionsAreas: boolean | null;
  farm: boolean | null;
  festivalsAndFairs: boolean | null;
  traditionalNationalHolidays: boolean | null;
  exhibitions: boolean | null;
  craftWorkshops: boolean | null;
}

export interface IExtrimDetails {
  type: 'extreme';
  quadBiking: boolean | null;
  buggyRiding: boolean | null;
  paragliding: boolean | null;
  ropeJumping: boolean | null;
  parachuting: boolean | null;
  jetSkiing: boolean | null;
  horsebackRiding: boolean | null;
  bungeeJumping: boolean | null;
  rafting: boolean | null;
  wakeboarding: boolean | null;
  snowboardingTrails: boolean | null;
  skiingTrails: boolean | null;
  tubingTrails: boolean | null;
  sleddingTrails: boolean | null;
  offRoadJeepTours: boolean | null;
  rockClimbing: boolean | null;
  mountaineering: boolean | null;
  iceRinks: boolean | null;
  huskySledding: boolean | null;
  reindeerSledding: boolean | null;
  zorbing: boolean | null;
}

export interface ISecurityDetails {
  type: 'security';
  medicalPoint: boolean | null;
  rescueServicePoint: boolean | null;
  pharmacy: boolean | null;
  policeStation: boolean | null;
  atm: boolean | null;
  currencyExchangePoint: boolean | null;
  deviceChargingArea: boolean | null;
  freeWiFiZone: boolean | null;
  taxi: boolean | null;
  transferService: boolean | null;
  concierge: boolean | null;
  resortBus: boolean | null;
}

export interface IRentDetails {
  type: 'rent';
  bicycles: boolean | null;
  electricScooters: boolean | null;
  snowboardsAndSkis: boolean | null;
  catamarans: boolean | null;
  boats: boolean | null;
  supBoards: boolean | null;
  fishingGear: boolean | null;
  campingEquipment: boolean | null;
  carRentalWithDriver: boolean | null;
}

export type AdDetailsType =
  | IChillDetails
  | ILivingPlaceDetails
  | IFoodDetails
  | IAttractionsDetails
  | IHealthDetails
  | IEntertainmentDetails
  | IExtrimDetails
  | ISecurityDetails
  | IRentDetails;
