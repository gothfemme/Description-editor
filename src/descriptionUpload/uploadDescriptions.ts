import { apiUrls } from '@data/urls'
import { databaseFilter, Locations } from '@descriptionConverter/descriptionFilter'
import { updateDatabase } from '@redux/globalSlice'
import { store } from '@redux/store'
import { customJsonStringify } from '@utils/customJsonStringify'
import { githubGet, githubPut } from '@utils/github'
import { cleanObject } from '@utils/removeEmptyFromObj'
import { sendMessage } from '@utils/sendMessage'
import { makeNewDatabase } from './makeNewDatabase'

export async function uploadToIntermediate(uploadingToLive: boolean) {
   sendMessage('Attempting upload => secondary')
   const oldDatabase = await githubGet('intermediate').then((data) => {
      if (typeof data === 'string') {
         return data
      }
      return {
         descriptions: JSON.parse(data.content),
         sha: data.sha
      }
   })
   // if it's string then it is error message
   if (typeof oldDatabase === 'string') {
      sendMessage(oldDatabase, 'error')
      return
   }

   const newDatabase = makeNewDatabase('intermediate', oldDatabase.descriptions, uploadingToLive)

   //--- used to update investmentStats
   // const getInvItem = async () => {
   //    const manifestResp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/')
   //    const manifest = await manifestResp.json()

   //    const inventoryItemLightUrl = `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`

   //    const invItemResp = await fetch(inventoryItemLightUrl)
   //    const invItem = await invItemResp.json()

   //    return invItem
   // }
   // const invItem = await getInvItem()
   // const newNewDatabase = Object.entries(newDatabase).reduce((acc, [hash, perk]) => {
   //    acc[hash] = {
   //       ...perk,
   //       // @ts-ignore
   //       investmentStats: invItem[hash]?.investmentStats?.filter((stat) =>
   //          stat.statTypeHash &&
   //          !String(stat.statTypeHash).match(/1480404414|1935470627|1885944937|3578062600/)
   //       )
   //    }

   //    return acc
   // }, newDatabase)
   // console.log(newNewDatabase)
   //!-- used to update investmentStats

   //--- used to add stuff in bulk
   // const getInvItem = async () => {
   //    const manifestResp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/')
   //    const manifest = await manifestResp.json()

   //    const invItemResp = await fetch(
   //       `https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`
   //    )
   //    const invItem = await invItemResp.json()

   //    return invItem
   // }
   // const invItem = await getInvItem()

   const hashes = {
      //    fragment: [
      //       362132288, 362132289, 362132290, 362132291, 362132292, 362132293, 362132294, 362132295, 362132300, 362132301,
      //       537774540, 537774541, 537774542, 537774543, 1051276348, 1051276349, 1051276350, 1051276351, 1727069360,
      //       1727069361, 1727069362, 1727069363, 1727069364, 1727069365, 1727069366, 1727069367, 1727069374, 1727069375,
      //       2272984656, 2272984657, 2272984664, 2272984665, 2272984666, 2272984667, 2272984668, 2272984669, 2272984670,
      //       2272984671, 2483898428, 2483898429, 2483898430, 2483898431, 2661180600, 2661180601, 2661180602, 2661180603,
      //       3277705904, 3277705905, 3277705906, 3277705907, 3469412968, 3469412969, 3469412970, 3469412971, 3469412974,
      //       3469412975
      //    ],
      //    aspect: [
      //       83039193, 83039194, 83039195, 187655372, 187655373, 187655374, 668903196, 668903197, 1293395729, 1293395730,
      //       1293395731, 1563930741, 1602994568, 1602994569, 1602994570, 1656549672, 1656549673, 1656549674, 1920417385,
      //       2031919264, 2031919265, 2321824284, 2321824285, 2321824287, 2642597904, 2651551055, 2934767476, 2934767477,
      //       2984351204, 2984351205, 2984351206, 3066103996, 3066103998, 3066103999, 3866705246, 4184589900, 4194622036,
      //       4194622037, 4194622038
      //    ],
      //    super: [
      //       119041298, 119041299, 375052468, 375052469, 375052471, 1081893460, 1081893461, 1656118680, 1656118681,
      //       1656118682, 2021620139, 2274196886, 2274196887, 2625980631, 2722573681, 2722573682, 2722573683, 2747500760,
      //       2747500761, 3683904166, 3769507632, 3769507633, 4260353952, 4260353953
      //    ],
      //    grenade: [
      //       1399216, 1399217, 1399219, 146194908, 1013086087, 1016030582, 1255073825, 1514173218, 1547656727, 1582574009,
      //       1713935764, 1841016428, 2202441959, 2216698406, 2265076177, 2481624867, 2581086849, 2809141585, 2909720723,
      //       2946990961, 2994412667, 3199702642, 3232422679, 3969294337, 4198689901
      //    ],
      //    melee: [
      //       852252788, 852252789, 1139822081, 1232050830, 1232050831, 1341767667, 1470370538, 1470370539, 2028772231,
      //       2299867342, 2543177538, 2708585276, 2708585277, 2708585279, 2716335210, 2716335211, 4016776972, 4016776973,
      //       4016776974, 4016776975, 4220332374, 4220332375
      //    ],
      //    class: [
      //       25156514, 25156515, 426473316, 426473317, 489583096, 489583097, 489583098, 2209081648, 2209081649, 2495523340,
      //       2495523341, 2722641740, 2722641741, 2816982784, 2816982785, 2979486801, 2979486802, 2979486803, 3260056808,
      //       3260056809, 3492047640, 3492047641, 3636300852, 3636300854, 3636300855, 3933525366, 3933525367
      //    ],
      //    movement: [
      //       20616656, 20616658, 20616659, 95544328, 95544329, 95544330, 95544331, 469281040, 469281041, 469281042,
      //       890263312, 890263313, 890263315, 1128768652, 1128768654, 1128768655, 1237488984, 1237488985, 1237488986,
      //       1237488987, 1380268164, 1380268166, 1380268167, 1698387812, 1698387814, 1698387815, 2225231092, 2225231093,
      //       2225231094, 3531427692, 3531427694, 3531427695, 3686638441, 3686638442, 3686638443, 4154539168, 4154539169,
      //       4154539171
      //    ],
      //    armorModCombat: [
      //       1484685884, 1484685885, 1484685886, 1484685887, 2263321584, 2263321585, 2263321586, 2263321587, 2979815164,
      //       2979815165, 2979815166, 2979815167, 3185435908, 3185435909, 3185435910, 3185435911, 3523075120, 3523075121,
      //       3523075122, 3523075123, 3632726236, 3632726237, 3632726238, 3632726239, 4272180932, 4272180933, 4272180934,
      //       4272180935, 179977568, 179977572, 179977573, 179977574, 179977575, 1789319804, 1789319805, 1789319806,
      //       1789319807, 2216063960, 2216063961, 2216063962, 2216063963, 2216063967, 2597888506, 2597888508, 2597888509,
      //       2597888510, 2597888511, 240958661, 825650462, 1052528480, 1196831979, 1358633824, 1358633825, 1515669996,
      //       1680735357, 1740246051, 1824486242, 1977242752, 1977242753, 1977242754, 1977242755, 2164090163, 2823326549,
      //       3097132144, 3730619869, 3809244044, 4044800076, 4044800077, 4213142382, 4288515060, 4288515061
      //    ],
      //    armorModActivity: [
      //       852793406, 1291268260, 1291268261, 1291268262, 1291268263, 2074494595, 3540739611, 3643044286, 899058084,
      //       1098978103, 1956421814, 2779468392, 2804214704, 2851458940, 3808234135, 3922904113, 4230067633, 518521232,
      //       518521233, 518521234, 1401506404, 1401506405, 1401506407, 2725575870, 2725575871, 4076776732, 4076776733,
      //       4076776734, 865380761, 928186993, 2037533514, 2887845822, 3415291596, 3630287380, 4020036031, 4134680615,
      //       399528760, 2589105944, 2859541905, 3570105787, 369171376, 2527938402, 1560574695, 1565861116, 1996040463,
      //       2023980600, 2045123179, 2874957617, 3736152098, 3829100654, 3895804619, 4193902249, 817361141, 1362793604,
      //       1578165808, 2142852459
      //    ],
      //    armorModSeasonal: [
      //       1324233023, 1404465537, 1404465538, 1404465539, 1404465540, 1404465541, 2187989976, 2187989982, 3521781034,
      //       3521781035, 3521781036, 3521781037, 3521781038, 3778343680, 3778343681, 3778343682, 3778343686, 3778343687
      //    ],
      //    weaponFrame: [
      //       40492375, 378204240, 395096174, 581875391, 621911507, 738967614, 749936529, 757651572, 846472617, 916649862,
      //       1020196213, 1057935015, 1068043187, 1220310607, 1241894699, 1300107783, 1338909520, 1370384437, 1447716563,
      //       1713394949, 1714663217, 1739861752, 1748364716, 1817649409, 1827389998, 1891876363, 1966150207, 2012877834,
      //       2101490074, 2155015844, 2170254329, 2213429699, 2419864979, 2444870733, 2470575005, 2662827496, 2670025099,
      //       2696719570, 2732540911, 2826720951, 2927971896, 3030812579, 3035281791, 3048420653, 3114731754, 3252839262,
      //       3260675681, 3291480605, 3332480988, 3472640090, 3513901081, 3573764622, 3615521782, 3665558569, 3728676938,
      //       3766386008, 3774850330, 3794558792, 4000302358, 4074888076, 31057037, 183772609, 216781713, 263649945,
      //       474269988, 715195141, 806997698, 836583820, 878286503, 895140517, 918679156, 996573084, 1019291327, 1113207372,
      //       1236001742, 1282254042, 1294026524, 1316753551, 1322370662, 1326668122, 1395789926, 1458010786, 1525239159,
      //       1636108362, 1713206376, 2057203855, 2108556049, 2213377102, 2353477480, 2757685314, 2874284214, 3330548924,
      //       3364911712, 3419274965, 3449390870, 3468089894, 3920852688, 3923638944, 3983457027, 4083543255, 4130495068,
      //       4172222323, 4172267910
      //    ],
      weaponFrameExotic: [
         {
            hash: 3024740338,
            itemHash: 14194600
         },
         {
            hash: 571267712,
            itemHash: 19024058
         },
         {
            hash: 2965975126,
            itemHash: 46524085
         },
         {
            hash: 1791592647,
            itemHash: 204878059
         },
         {
            hash: 647617635,
            itemHash: 347366834
         },
         {
            hash: 1315870387,
            itemHash: 370712896
         },
         {
            hash: 2585427437,
            itemHash: 374573733
         },
         {
            hash: 4208418110,
            itemHash: 400096939
         },
         {
            hash: 1656957541,
            itemHash: 417164956
         },
         {
            hash: 3551884421,
            itemHash: 542203595
         },
         {
            hash: 986191425,
            itemHash: 603721696
         },
         {
            hash: 961505134,
            itemHash: 776191470
         },
         {
            hash: 1470121888,
            itemHash: 814876684
         },
         {
            hash: 1573888036,
            itemHash: 814876685
         },
         {
            hash: 2491817779,
            itemHash: 1201830623
         },
         {
            hash: 2641107734,
            itemHash: 1234150730
         },
         {
            hash: 377257911,
            itemHash: 1331482397
         },
         {
            hash: 3755070117,
            itemHash: 1345867570
         },
         {
            hash: 1036269296,
            itemHash: 1345867571
         },
         {
            hash: 1657401727,
            itemHash: 1363238943
         },
         {
            hash: 2962361451,
            itemHash: 1363886209
         },
         {
            hash: 2770223582,
            itemHash: 1364093401
         },
         {
            hash: 2261491232,
            itemHash: 1395261499
         },
         {
            hash: 2473404935,
            itemHash: 1508896098
         },
         {
            hash: 3208839961,
            itemHash: 1541131350
         },
         {
            hash: 3837077246,
            itemHash: 1594120904
         },
         {
            hash: 2223914385,
            itemHash: 1665952087
         },
         {
            hash: 3751354116,
            itemHash: 1744115122
         },
         {
            hash: 2940035732,
            itemHash: 1763584999
         },
         {
            hash: 2724693746,
            itemHash: 1802135586
         },
         {
            hash: 3164944314,
            itemHash: 1833195496
         },
         {
            hash: 459441288,
            itemHash: 1852863732
         },
         {
            hash: 975429949,
            itemHash: 1853180924
         },
         {
            hash: 3642491337,
            itemHash: 1864563948
         },
         {
            hash: 281315705,
            itemHash: 1891561814
         },
         {
            hash: 1531126198,
            itemHash: 2044500762
         },
         {
            hash: 1657056865,
            itemHash: 2069224589
         },
         {
            hash: 2608508147,
            itemHash: 2084878005
         },
         {
            hash: 2564164194,
            itemHash: 2130065553
         },
         {
            hash: 2984682260,
            itemHash: 2179048386
         },
         {
            hash: 1927916065,
            itemHash: 2208405142
         },
         {
            hash: 411799453,
            itemHash: 2232171099
         },
         {
            hash: 630329983,
            itemHash: 2286143274
         },
         {
            hash: 3063320916,
            itemHash: 2357297366
         },
         {
            hash: 2121086290,
            itemHash: 2362471601
         },
         {
            hash: 389268985,
            itemHash: 2376481550
         },
         {
            hash: 2200569208,
            itemHash: 2399110176
         },
         {
            hash: 1186480754,
            itemHash: 2415517654
         },
         {
            hash: 1900919151,
            itemHash: 2535142413
         },
         {
            hash: 1699724249,
            itemHash: 2591746970
         },
         {
            hash: 2909403175,
            itemHash: 2603483885
         },
         {
            hash: 3649430342,
            itemHash: 2694576561
         },
         {
            hash: 1174163613,
            itemHash: 2812324400
         },
         {
            hash: 2733244971,
            itemHash: 2812324401
         },
         {
            hash: 4004944400,
            itemHash: 2816212794
         },
         {
            hash: 944506345,
            itemHash: 2856683562
         },
         {
            hash: 507151084,
            itemHash: 2907129556
         },
         {
            hash: 4045839491,
            itemHash: 2907129557
         },
         {
            hash: 2516532331,
            itemHash: 3089417789
         },
         {
            hash: 2540536653,
            itemHash: 3110698812
         },
         {
            hash: 938999636,
            itemHash: 3141979346
         },
         {
            hash: 3081173348,
            itemHash: 3141979347
         },
         {
            hash: 1070100196,
            itemHash: 3211806999
         },
         {
            hash: 3239299468,
            itemHash: 3260753130
         },
         {
            hash: 4148158229,
            itemHash: 3325463374
         },
         {
            hash: 1000724343,
            itemHash: 3413074534
         },
         {
            hash: 1394384862,
            itemHash: 3413860062
         },
         {
            hash: 481338655,
            itemHash: 3413860063
         },
         {
            hash: 1030990989,
            itemHash: 3437746471
         },
         {
            hash: 536517534,
            itemHash: 3460576091
         },
         {
            hash: 2179914730,
            itemHash: 3487253372
         },
         {
            hash: 3441203855,
            itemHash: 3505113722
         },
         {
            hash: 2144092201,
            itemHash: 3512014804
         },
         {
            hash: 3174300811,
            itemHash: 3524313097
         },
         {
            hash: 425960662,
            itemHash: 3549153978
         },
         {
            hash: 2977709078,
            itemHash: 3549153979
         },
         {
            hash: 372430833,
            itemHash: 3580904580
         },
         {
            hash: 1210807262,
            itemHash: 3580904581
         },
         {
            hash: 2186532310,
            itemHash: 3588934839
         },
         {
            hash: 3905543891,
            itemHash: 3628991658
         },
         {
            hash: 2307143135,
            itemHash: 3628991659
         },
         {
            hash: 1319823571,
            itemHash: 3654674561
         },
         {
            hash: 1100877327,
            itemHash: 3664831848
         },
         {
            hash: 2881100038,
            itemHash: 3761898871
         },
         {
            hash: 4072668471,
            itemHash: 3766045777
         },
         {
            hash: 334466122,
            itemHash: 3824106094
         },
         {
            hash: 3668782036,
            itemHash: 3844694310
         },
         {
            hash: 213689231,
            itemHash: 3856705927
         },
         {
            hash: 3913463509,
            itemHash: 3899270607
         },
         {
            hash: 1863355414,
            itemHash: 3973202132
         },
         {
            hash: 4185339856,
            itemHash: 4017959782
         },
         {
            hash: 3884127242,
            itemHash: 4036115577
         },
         {
            hash: 1484442054,
            itemHash: 4068264807
         },
         {
            hash: 1797707170,
            itemHash: 4103414242
         },
         {
            hash: 3610814281,
            itemHash: 4124984448
         },
         {
            hash: 656200654,
            itemHash: 4190156464
         },
         {
            hash: 2741975068,
            itemHash: 4255268456
         },
         {
            hash: 3610750208,
            itemHash: 4289226715
         },
         {
            hash: 3602718766,
            itemHash: 4293613902
         }
      ],
      //    weaponCatalystExotic: [
      //       82994288, 136852797, 229096166, 383825919, 431220296, 431220297, 456628588, 456628589, 466834938, 484491717,
      //       529188544, 615063266, 615063267, 658317088, 674410190, 769440797, 838219733, 862513617, 920755188, 924149234,
      //       924149235, 970163821, 1023764762, 1061006937, 1149703256, 1178660677, 1206010521, 1234111636, 1249968538,
      //       1249968539, 1298151900, 1301843770, 1324340508, 1324556594, 1380383475, 1496699324, 1550063955, 1557274655,
      //       1684153732, 1719307618, 1733620422, 1758592809, 1783582993, 1824496860, 1824496861, 1864989992, 1880379474,
      //       2085058762, 2085058763, 2094761202, 2132353550, 2145198832, 2271572658, 2362217257, 2409031770, 2526801077,
      //       2674202880, 2732252706, 2732814938, 2826187530, 2888418988, 2895039606, 2984240082, 3072857252, 3156882011,
      //       3274907024, 3352275956, 3457865914, 3457865915, 3459475454, 3466057365, 3591914291, 3708505013, 3810173190,
      //       3967134106, 3978937353, 4001063065, 4067652714, 4079681314, 4091235251, 4218954970, 4259872956, 4273298922
      //    ],
      weaponPerkExotic: [
         {
            hash: 3492337375,
            itemHash: 14194600
         },
         {
            hash: 3470828242,
            itemHash: 19024058
         },
         {
            hash: 4015745376,
            itemHash: 46524085
         },
         {
            hash: 2130042297,
            itemHash: 204878059
         },
         {
            hash: 1561789734,
            itemHash: 347366834
         },
         {
            hash: 1549056416,
            itemHash: 370712896
         },
         {
            hash: 1208312843,
            itemHash: 374573733
         },
         {
            hash: 3242533954,
            itemHash: 400096939
         },
         {
            hash: 3275789089,
            itemHash: 417164956
         },
         {
            hash: 844190854,
            itemHash: 542203595
         },
         {
            hash: 1385518514,
            itemHash: 603721696
         },
         {
            hash: 3772485195,
            itemHash: 776191470
         },
         {
            hash: 2287699930,
            itemHash: 814876684
         },
         {
            hash: 200829441,
            itemHash: 814876685
         },
         {
            hash: 2911329003,
            itemHash: 1201830623
         },
         {
            hash: 1271851280,
            itemHash: 1234150730
         },
         {
            hash: 3100590152,
            itemHash: 1331482397
         },
         {
            hash: 1853177948,
            itemHash: 1345867570
         },
         {
            hash: 2482418662,
            itemHash: 1345867571
         },
         {
            hash: 798520364,
            itemHash: 1363238943
         },
         {
            hash: 3874977694,
            itemHash: 1363886209
         },
         {
            hash: 1866048759,
            itemHash: 1364093401
         },
         {
            hash: 2846385770,
            itemHash: 1395261499
         },
         {
            hash: 1178686995,
            itemHash: 1508896098
         },
         {
            hash: 1289604610,
            itemHash: 1541131350
         },
         {
            hash: 3556949035,
            itemHash: 1594120904
         },
         {
            hash: 407549716,
            itemHash: 1665952087
         },
         {
            hash: 1408800487,
            itemHash: 1763584999
         },
         {
            hash: 2094939076,
            itemHash: 1802135586
         },
         {
            hash: 1218765758,
            itemHash: 1833195496
         },
         {
            hash: 2306441428,
            itemHash: 1852863732
         },
         {
            hash: 24925370,
            itemHash: 1853180924
         },
         {
            hash: 3337692349,
            itemHash: 1891561814
         },
         {
            hash: 1866048759,
            itemHash: 2044500762
         },
         {
            hash: 3504197951,
            itemHash: 2069224589
         },
         {
            hash: 1185273366,
            itemHash: 2084878005
         },
         {
            hash: 1683379515,
            itemHash: 2130065553
         },
         {
            hash: 2795311559,
            itemHash: 2179048386
         },
         {
            hash: 3970637031,
            itemHash: 2208405142
         },
         {
            hash: 3333994164,
            itemHash: 2232171099
         },
         {
            hash: 3551326236,
            itemHash: 2286143274
         },
         {
            hash: 745965939,
            itemHash: 2357297366
         },
         {
            hash: 861489047,
            itemHash: 2362471601
         },
         {
            hash: 588594999,
            itemHash: 2376481550
         },
         {
            hash: 1281243303,
            itemHash: 2399110176
         },
         {
            hash: 4190643473,
            itemHash: 2415517654
         },
         {
            hash: 2379536009,
            itemHash: 2535142413
         },
         {
            hash: 2399646028,
            itemHash: 2591746970
         },
         {
            hash: 3117514172,
            itemHash: 2603483885
         },
         {
            hash: 777637181,
            itemHash: 2694576561
         },
         {
            hash: 1679262379,
            itemHash: 2812324400
         },
         {
            hash: 2620589274,
            itemHash: 2812324401
         },
         {
            hash: 1866048759,
            itemHash: 2816212794
         },
         {
            hash: 1378047685,
            itemHash: 2856683562
         },
         {
            hash: 2238035098,
            itemHash: 2907129556
         },
         {
            hash: 4115637021,
            itemHash: 2907129557
         },
         {
            hash: 1530804125,
            itemHash: 3089417789
         },
         {
            hash: 3351002503,
            itemHash: 3110698812
         },
         {
            hash: 939227542,
            itemHash: 3141979346
         },
         {
            hash: 501717180,
            itemHash: 3141979347
         },
         {
            hash: 2866798147,
            itemHash: 3211806999
         },
         {
            hash: 3298446480,
            itemHash: 3260753130
         },
         {
            hash: 1419069769,
            itemHash: 3325463374
         },
         {
            hash: 2387244414,
            itemHash: 3413074534
         },
         {
            hash: 1658733671,
            itemHash: 3413860062
         },
         {
            hash: 299272945,
            itemHash: 3413860063
         },
         {
            hash: 2383960413,
            itemHash: 3437746471
         },
         {
            hash: 3937312904,
            itemHash: 3460576091
         },
         {
            hash: 290014589,
            itemHash: 3487253372
         },
         {
            hash: 2395713912,
            itemHash: 3505113722
         },
         {
            hash: 743139589,
            itemHash: 3512014804
         },
         {
            hash: 1687327062,
            itemHash: 3524313097
         },
         {
            hash: 2003108620,
            itemHash: 3549153978
         },
         {
            hash: 1650852150,
            itemHash: 3580904580
         },
         {
            hash: 25692695,
            itemHash: 3580904581
         },
         {
            hash: 957782887,
            itemHash: 3588934839
         },
         {
            hash: 320534106,
            itemHash: 3628991658
         },
         {
            hash: 4146729347,
            itemHash: 3628991659
         },
         {
            hash: 873883409,
            itemHash: 3664831848
         },
         {
            hash: 1690446783,
            itemHash: 3761898871
         },
         {
            hash: 1059301209,
            itemHash: 3824106094
         },
         {
            hash: 2387244414,
            itemHash: 3844694310
         },
         {
            hash: 2019952880,
            itemHash: 3899270607
         },
         {
            hash: 2921090754,
            itemHash: 3973202132
         },
         {
            hash: 127335543,
            itemHash: 4017959782
         },
         {
            hash: 588594999,
            itemHash: 4036115577
         },
         {
            hash: 2814973067,
            itemHash: 4068264807
         },
         {
            hash: 1185480639,
            itemHash: 4103414242
         },
         {
            hash: 2620589274,
            itemHash: 4124984448
         },
         {
            hash: 2333607307,
            itemHash: 4190156464
         },
         {
            hash: 176919422,
            itemHash: 4255268456
         },
         {
            hash: 806917387,
            itemHash: 4289226715
         },
         {
            hash: 3131590896,
            itemHash: 4293613902
         }
      ]
   }

   // const newNewDatabase = Object.entries(hashes).reduce((acc, [type, hashArr]) => {
   //    hashArr.forEach((hash) => {
   //       if (acc[hash]) return

   //       acc[hash] = {
   //          hash: Number(hash),
   //          name: invItem[hash].displayProperties.name,
   //          type,
   //          lastUpload: 0,
   //          uploadedBy: '',
   //          editor: {
   //             en: {
   //                main: invItem[hash].displayProperties.description || '',
   //                secondary: invItem[hash].displayProperties.description || ''
   //             }
   //          },
   //          updateTracker: {
   //             stats: {
   //                lastUpdate: 0,
   //                updatedBy: ''
   //             },
   //             descriptions: {
   //                en: {
   //                   lastUpdate: 0,
   //                   updatedBy: ''
   //                }
   //             }
   //          },
   //          uploadToLive: false,
   //          hidden: false,
   //          inLiveDatabase: false,
   //          optional: false
   //       }
   //    })

   //    return acc
   // }, newDatabase)
   // console.log(newNewDatabase)
   //!-- used to add stuff in bulk

   const message = await githubPut('intermediate', {
      content: customJsonStringify(cleanObject(newDatabase)),
      sha: oldDatabase.sha
   })

   if (typeof message === 'string') {
      sendMessage(message, 'error')
   } else {
      sendMessage('Uploaded => secondary', 'success')
      store.dispatch(updateDatabase({ databaseType: 'intermediate', newDatabase }))
      return true
   }
}

export async function uploadToLive() {
   const uploadStatus = await uploadToIntermediate(true)
   if (!uploadStatus) return

   sendMessage('Attempting upload => live')
   const oldDatabase = await githubGet('live').then((data) => {
      if (typeof data === 'string') return data
      return {
         descriptions: JSON.parse(data.content),
         sha: data.sha
      }
   })
   // if it's string then it is error message
   if (typeof oldDatabase === 'string') {
      sendMessage(oldDatabase, 'error')
      return
   }

   const newDatabase = makeNewDatabase('live', oldDatabase.descriptions)

   // databaseFilter(newDatabase, 'crayon') // ! used for testing

   const upload = async (location: Locations, sha: string) => {
      const finalDatabase = await databaseFilter(newDatabase, location)

      const message = await githubPut(location, {
         content: JSON.stringify(finalDatabase, undefined, 1),
         sha
      })

      if (typeof message === 'string') {
         sendMessage(message, 'error')
      } else {
         sendMessage(`Uploaded => ${location}`, 'success')
         return true
      }
   }

   const getShas = (location: keyof typeof apiUrls) =>
      githubGet(location).then((data) => {
         if (typeof data === 'string') return data
         return {
            sha: data.sha
         }
      })
   const shas = await Promise.all([
      getShas('live'),
      getShas('clarity'),
      getShas('crayon'),
      getShas('dim'),
      getShas('lightGG')
   ])

   // check if everything is fine
   if (shas.some((sha) => typeof sha === 'string')) {
      sendMessage('Something went wrong while getting sha', 'error')
      return
   }
   const newShas = shas.flatMap((sha) => {
      if (typeof sha === 'string') return []
      return sha.sha
   })

   const updateVersion = async () => {
      const version = await githubGet('versions')
      if (typeof version === 'string') return version

      const oldVersion = JSON.parse(version.content)
      const newVersion = JSON.stringify({
         ...oldVersion,
         descriptions: Number(oldVersion.descriptions) + 0.01
      })

      const versionUpdateStatus = await githubPut('versions', { content: newVersion, sha: version.sha })
      if (typeof versionUpdateStatus === 'string') return versionUpdateStatus

      sendMessage(`Version updated to ${Number(oldVersion.descriptions) + 0.01}`, 'success')
      return true
   }

   const descriptionUploadStatus = await Promise.all([
      upload('clarity', newShas[1]),
      upload('crayon', newShas[2]),
      upload('dim', newShas[3]),
      upload('lightGG', newShas[4])
   ])
   if (descriptionUploadStatus.every((status) => status === true)) {
      const updatedLive = await githubPut('live', {
         content: customJsonStringify(cleanObject(newDatabase)),
         sha: newShas[0]
      })
      const updatedVersion = await updateVersion()
      if (updatedLive === true && updatedVersion === true) {
         sendMessage('All uploads completed 🍕', 'success')
         store.dispatch(updateDatabase({ databaseType: 'intermediate', newDatabase }))
      } else {
         if (typeof updatedLive === 'string') sendMessage(updatedLive, 'error')
         if (typeof updatedVersion === 'string') sendMessage(updatedVersion, 'error')
      }
   }
}
