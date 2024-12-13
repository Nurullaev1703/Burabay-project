import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Utils } from 'src/utilities';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async seedCategoryAndSubcategory() {
    try {
      const data = {
        'Отдых': {
          'description': 'Туристическая тропа, грибное место, зона для отдыха и пикников, и т.д.',
          'imgPath': '/icons/chill.svg',
          'subcategories': [
            'Туристические тропы',
            'Грибные места',
            'Рыбные места',
            'Зоны для отдыха и пикников',
            'Игровые площади',
            'Пляжи и водоемы',
          ],
          'details': [
            'equippedBeach',
            'wildBeach',
            'restingCanopy',
            'barbecueArea',
            'tablesAndBenches',
            'barbecueZone',
            'waterAccessArea',
            'tennisCourts',
            'footballField',
            'golfCourse',
            'beachVolleyball',
            'childrensPlayground',
            'ropePark',
            'routeWithSignposts',
            'mountainTrail',
            'forestTrail',
            'wildlifeObservationArea',
            'fishingSpot',
            'huntingSpot',
            'mushroomPickingArea',
            'berryPickingArea',
            'equippedCampingSite',
            'wildCampingSite',
            'winterFishing',
          ],
        },
        'Жилье': {
          'description': 'Гостиницы, санатории, квартиры, команты, дома и коттеджи, и т.д.',
          'imgPath': '/icons/home.svg',
          'subcategories': [
            'Гостиницы',
            'Квартиры',
            'Комнаты',
            'Дома и Коттеджи',
            'Хостелы',
            'Гостевые дома',
            'Апарт-отели',
            'Мини-гостиницы',
          ],
          'details': [
            'freeWiFi',
            'privateParking',
            'breakfastIncluded',
            'dailyCleaning',
            'airConditioning',
            'refrigerator',
            'television',
            'kettle',
            'heating',
            'receptionAnd24HourService',
            'onSitePool',
            'onSiteSauna',
            'spaZone',
            'directAccessToNature',
            'onSiteBonfireZones',
            'excursionProgramsAndTours',
            'onSiteEntertainmentActivities',
            'onSiteChildrenPlayArea',
            'onSiteRestaurantAndBar',
            'laundryAndDryCleaningServices',
            'washingMachine',
            'iron',
            'waterView',
            'forestView',
            'gardensAndFlowerbeds',
            'kitchenUtensilsPlatesCupsCutlery',
            'equippedPrivateKitchen',
            'equippedSharedKitchen',
            'fireplace',
            'gymAndFitnessCenter',
            'medicalTreatments',
            'onSiteConferenceRoom',
          ],
        },
        'Питание': {
          'description': 'Кафе, столовые, рестораны',
          'imgPath': '/icons/food.svg',
          'subcategories': ['Кафе', 'Рестораны', 'Столовые'],
          'details': [
            'europeanCuisine',
            'easternCuisine',
            'kidsMenu',
            'vegetarianDishes',
            'glutenAndLactoseFreeDishes',
            'dietaryMenu',
            'freshAndOrganicFood',
            'kazakhNationalCuisine',
            'italianCuisine',
            'japaneseCuisine',
            'detoxCocktails',
            'sportsNutrition',
            'wineList',
            'outdoorSeatingTerraces',
            'privateParking',
            'liveMusic',
          ],
        },
        'Достопримечательности': {
          'description': 'Исторические и культурные объекты, музеи, памятники, парки, и т.д.',
          'imgPath': '/icons/wow.svg',
          'subcategories': ['Особые памятники и объекты культуры'],
          'details': [
            'historicalPlace',
            'museum',
            'naturalMonument',
            'observationArea',
            'park',
            'monument',
            'sculpture',
            'castle',
            'fortress',
            'archaeologicalSite',
            'resortSightseeingTour',
            'abylaiKhanGladeTour',
            'bolektauMountainHike',
            'okzhetpesMountainHike',
            'kokchetauMountainHike',
            'excursion',
            'busTours',
          ],
        },
        'Здоровье': {
          'description': 'Медицинские центры, санатории, SPA-салоны, фитнес-клубы, и т.д.',
          'imgPath': '/icons/health.svg',
          'subcategories': ['Оздоровление'],
          'details': [
            'bodyWrap',
            'peeling',
            'sauna',
            'steamBathWithAttendant',
            'hydroMassageAndJacuzzi',
            'mineralWaterPool',
            'mudBath',
            'mineralBath',
            'aromatherapy',
            'classicMassage',
            'thaiMassage',
            'professionalWellnessMassage',
            'meditationSession',
            'yogaClass',
            'facialCare',
            'bodyCare',
            'hairCare',
            'nailCare',
            'hydroMassagePool',
            'charcotShower',
            'saltRoom',
            'thermalSpring',
            'rehabilitationProgram',
            'fitnessClassWithTrainer',
            'cardioTraining',
            'pilates',
            'relaxationAndRecreationArea',
            'inhalationProcedure',
            'cosmeticProcedure',
            'rejuvenationProgram',
            'hammockAndLoungerZone',
            'teaCeremony',
            'quietZoneWithBackgroundMusic',
            'martialArtsClass',
            'specialDetoxProgram',
            'musculoskeletalSystemProgram',
            'mudCosmeticProcedure',
            'therapeuticSwimming',
            'jointTherapyApplication',
            'turkishHammam',
            'privateSpaRoom',
            'groupMeditationSession',
            'relaxationMassage',
            'mineralSprings',
            'russianBath',
            'finnishBath',
            'turkishBath',
            'yogaHall',
            'massageSalon',
            'therapeuticProgram',
          ],
        },
        'Развлечения': {
          'description': 'Вечеринки и шоу, местный зоопарк, парк атракционов, экскурсии, и т.д.',
          'imgPath': '/icons/fun.svg',
          'subcategories': [
            'Вечеринки и шоу',
            'Зоопарки',
            'Парки аттракционов',
            'Развлекательные заведения',
            'Экскурсии',
            'Культурные мероприятия',
            'Сувенирные магазины',
          ],
          'details': [
            'amusementPark',
            'waterPark',
            'zoo',
            'pettingZoo',
            'goKarting',
            'bowling',
            'disco',
            'karaoke',
            'party',
            'show',
            'concert',
            'celebration',
            'culturalEvent',
            'souvenirShop',
            'souvenirAndLocalCraftShops',
            'pontoonBoatWaterTours',
            'attractionsAreas',
            'farm',
            'festivalsAndFairs',
            'traditionalNationalHolidays',
            'exhibitions',
            'craftWorkshops',
          ],
        },
        'Экстрим': {
          'description': 'Активные виды спорта, альпинизм, парапланы, квадроциклы, и т.д.',
          'imgPath': '/icons/extrim.svg',
          'subcategories': ['Экстримальный отдых'],
          'details': [
            'quadBiking',
            'buggyRiding',
            'paragliding',
            'ropeJumping',
            'parachuting',
            'jetSkiing',
            'horsebackRiding',
            'bungeeJumping',
            'rafting',
            'wakeboarding',
            'snowboardingTrails',
            'skiingTrails',
            'tubingTrails',
            'sleddingTrails',
            'offRoadJeepTours',
            'rockClimbing',
            'mountaineering',
            'iceRinks',
            'huskySledding',
            'reindeerSledding',
            'zorbing',
          ],
        },
        'Прокат': {
          'description': 'Автотранспорт, снаряжение, средства индивидуальной мобильности',
          'imgPath': '/icons/prokate.svg',
          'subcategories': ['Прокат и аренда снаряжения и оборудования'],
          'details': [
            'bicycles',
            'electricScooters',
            'snowboardsAndSkis',
            'catamarans',
            'boats',
            'supBoards',
            'fishingGear',
            'campingEquipment',
            'carRentalWithDriver',
          ],
        },
        'Безопасность': {
          'description': 'Аптеки, банкоматы, консьерж-сервисы',
          'imgPath': '/icons/security.svg',
          'subcategories': ['Инфраструктура и безопасность'],
          'details': [
            'medicalPoint',
            'rescueServicePoint',
            'pharmacy',
            'policeStation',
            'atm',
            'currencyExchangePoint',
            'deviceChargingArea',
            'freeWiFiZone',
            'taxi',
            'transferService',
            'concierge',
            'resortBus',
          ],
        },
      };

      for (const [categoryName, categoryData] of Object.entries(data)) {
        if (!(await this.categoryRepository.findOne({ where: { name: categoryName } }))) {
          const category = this.categoryRepository.create({
            name: categoryName,
            description: categoryData.description,
            imgPath: categoryData.imgPath,
            details: categoryData.details,
          });
          await this.categoryRepository.save(category);
          for (const subcategoryName of categoryData.subcategories) {
            if (!(await this.subcategoryRepository.findOne({ where: { name: subcategoryName } }))) {
              const subcategory = this.subcategoryRepository.create({
                name: subcategoryName,
                category: category,
              });
              await this.subcategoryRepository.save(subcategory);
            }
          }
        }
      }
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
  // TODO Потом удалить.
  async seedAds() {
    try {
      let org: Organization;
      if (!(await this.orgRepository.findOne({ where: { name: 'Тестовая организация' } }))) {
        org = await this.orgRepository.create({
          imgUrl: 'img_link',
          name: 'Тестовая организация',
          address: 'Pavlodar',
          isConfirmed: true,
          description: "Мы занимаемся всем подряд и не только",
          siteUrl:"https://wikipedia.org"
        });
        await this.orgRepository.save(org);
      } else {
        org = await this.orgRepository.findOne({ where: { name: 'Тестовая организация' } });
      }

      const subcategories = [
        'Туристические тропы',
        'Грибные места',
        'Игровые площади',
        'Гостиницы',
        'Квартиры',
        'Комнаты',
        'Кафе',
        'Рестораны',
        'Столовые',
      ];
      for (let i = 0; i < 9; i++) {
        const subcategory = await this.subcategoryRepository.findOne({
          where: { name: subcategories[i] },
        });
        if (!(await this.adRepository.findOne({ where: { title: 'Объявление №' + i } }))) {
          const ad = this.adRepository.create({
            title: 'Объявление №' + i,
            description: 'Описание объявления №' + i,
            price: Math.floor(Math.random() * 1000),
            images: ['images_path'],
            youtubeLink: 'youtube_link',
            address: 'Pavlodar',
            phoneNumber: '+77077045632',
            subcategory: subcategory,
            details: {
              type: 'rent',
              bicycles: true,
              electricScooters: true,
              campingEquipment: true,
              carRentalWithDriver: true,
            },
            organization: org,
          });
          await this.adRepository.save(ad);
        }
      }
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
  async seed() {
    await this.seedCategoryAndSubcategory();
    await this.seedAds();
  }
}
