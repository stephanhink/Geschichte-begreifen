// English translations of the map texts for every module that has a map:
//   karte.phasen[].label, karte.phasen[].flaechen[].titel,
//   karte.bewegungen[].name, karte.punkte[].name, karte.beschriftungen[].text.
// Geometry (d, basis, coordinates) and hinweis are intentionally NOT included
// — see the German modules in utils/themen/ for the shapes.

module.exports = {
  "roemisches-reich": {
    phasen: [
      { label: "264 BC", flaechen: [
        { titel: "Italy as far as the Rubicon" }
      ] },
      { label: "146 BC", flaechen: [
        { titel: "Italy with the Po Valley" },
        { titel: "Sicily — the first province" },
        { titel: "Sardinia" },
        { titel: "Corsica" },
        { titel: "The Hispanic provinces" },
        { titel: "Africa — the territory of Carthage" },
        { titel: "Macedonia and Greece" }
      ] },
      { label: "117 AD", flaechen: [
        { titel: "The European bloc" },
        { titel: "Britain up to Hadrian’s Wall" },
        { titel: "North Africa and Egypt" },
        { titel: "Asia Minor, Syria and Arabia" },
        { titel: "Mesopotamia and Armenia" },
        { titel: "Dacia" }
      ] },
      { label: "476 AD", flaechen: [
        { titel: "What remained of the Western Empire" },
        { titel: "The Eastern Roman Empire — it continued to exist" }
      ] }
    ],
    bewegungen: [
      { name: "Huns" },
      { name: "Visigoths" },
      { name: "Vandals" }
    ],
    punkte: [
      { name: "Rome" },
      { name: "Carthage" },
      { name: "Limes" },
      { name: "Teutoburg Forest" },
      { name: "Alexandria" },
      { name: "Constantinople" }
    ],
    beschriftungen: [
      { text: "Britain" },
      { text: "Gaul" },
      { text: "Germania" },
      { text: "Hispania" },
      { text: "Italy" },
      { text: "Greece" },
      { text: "Asia Minor" },
      { text: "Egypt" },
      { text: "North Africa" },
      { text: "Mesopotamia" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "North Sea" }
    ]
  },
  "china": {
    phasen: [
      { label: "221 BC", flaechen: [
        { titel: "The Empire of the First Emperor" }
      ] },
      { label: "100 AD", flaechen: [
        { titel: "The Han Empire" },
        { titel: "The Western Territories around the Taklamakan" },
        { titel: "Lelang in the north of Korea" }
      ] },
      { label: "750 AD", flaechen: [
        { titel: "The Tang Empire" },
        { titel: "The Anxi Protectorate — the Western Territories" }
      ] }
    ],
    bewegungen: [
      { name: "Zhang Qian to the West" },
      { name: "Caravans of the Silk Road" },
      { name: "The Xiongnu at the northern border" }
    ],
    punkte: [
      { name: "Chang’an" },
      { name: "Great Wall" },
      { name: "Dunhuang" },
      { name: "Kashgar" },
      { name: "Samarkand" },
      { name: "On to Rome" }
    ],
    beschriftungen: [
      { text: "China" },
      { text: "Korea" },
      { text: "Japan" },
      { text: "Tibet" },
      { text: "Himalayas" },
      { text: "India" },
      { text: "Persia" },
      { text: "Gobi Desert" },
      { text: "Steppe of the Xiongnu" },
      { text: "Silk Road" },
      { text: "Yellow Sea" },
      { text: "East China Sea" },
      { text: "South China Sea" }
    ]
  },
  "dschingis-khan": {
    phasen: [
      { label: "1206", flaechen: [
        { titel: "The united tribes of the steppe" }
      ] },
      { label: "1227", flaechen: [
        { titel: "The Empire at Genghis Khan’s death" }
      ] },
      { label: "1259", flaechen: [
        { titel: "The Great Khanate" },
        { titel: "The Golden Horde" },
        { titel: "The Ilkhanate" },
        { titel: "Korea as a vassal" }
      ] },
      { label: "1294", flaechen: [
        { titel: "The Yuan Empire" },
        { titel: "The Chagatai Khanate" },
        { titel: "The Golden Horde" },
        { titel: "The Ilkhanate" },
        { titel: "Korea" }
      ] }
    ],
    bewegungen: [
      { name: "The first Western campaign (1219–1223)" },
      { name: "Batu’s Western expedition (1236–1242)" },
      { name: "Hülegü to Baghdad (1256–1258)" },
      { name: "Kublai against the Song (1268–1279)" }
    ],
    punkte: [
      { name: "Karakorum" },
      { name: "Dadu" },
      { name: "Samarkand" },
      { name: "Baghdad" },
      { name: "Liegnitz" },
      { name: "Caffa" }
    ],
    beschriftungen: [
      { text: "Europe" },
      { text: "Russia" },
      { text: "Steppe" },
      { text: "Persia" },
      { text: "Mongolia" },
      { text: "Gobi" },
      { text: "Silk Road" },
      { text: "Himalayas" },
      { text: "China" },
      { text: "Korea" },
      { text: "Japan" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "Caspian Sea" },
      { text: "Yellow Sea" }
    ]
  },
  "japan": {
    phasen: [
      { label: "around 600", flaechen: [
        { titel: "The heartland of the Yamato rulers" },
        { titel: "Shikoku" },
        { titel: "Kyushu — the gateway to the mainland" }
      ] },
      { label: "1274 and 1281", flaechen: [
        { titel: "Japan under the military government of Kamakura" },
        { titel: "Shikoku" },
        { titel: "Kyushu — both fleets landed here" },
        { titel: "Goryeo — Korea under Mongol suzerainty" }
      ] },
      { label: "around 1700", flaechen: [
        { titel: "The realm of the Tokugawa shoguns" },
        { titel: "Shikoku" },
        { titel: "Kyushu" },
        { titel: "Sado — the shogunate’s gold island" },
        { titel: "Matsumae — the outpost on Ezo" }
      ] },
      { label: "1868", flaechen: [
        { titel: "The Empire of Japan" },
        { titel: "Shikoku" },
        { titel: "Kyushu" },
        { titel: "Sado" },
        { titel: "Hokkaido — the former Ezo" }
      ] }
    ],
    bewegungen: [
      { name: "The path of knowledge from the mainland" },
      { name: "The first Mongol invasion, 1274" },
      { name: "The second invasion, 1281 — the fleet from China" },
      { name: "Perry’s black ships, 1853" }
    ],
    punkte: [
      { name: "Nara" },
      { name: "Kyoto" },
      { name: "Kamakura" },
      { name: "Edo (Tokyo)" },
      { name: "Dejima near Nagasaki" },
      { name: "Tsushima" }
    ],
    beschriftungen: [
      { text: "Japan" },
      { text: "Honshu" },
      { text: "Kyushu" },
      { text: "Shikoku" },
      { text: "Hokkaido" },
      { text: "Korea" },
      { text: "China" },
      { text: "Yellow Sea" },
      { text: "Sea of Japan" },
      { text: "East China Sea" },
      { text: "Pacific Ocean" }
    ]
  },
  "israel-palaestina": {
    phasen: [
      { label: "Partition Plan 1947", flaechen: [
        { titel: "Jewish State — Eastern Galilee (1947 Plan)" },
        { titel: "Jewish State — the coastal plain (1947 Plan)" },
        { titel: "Jewish State — the Negev (1947 Plan)" },
        { titel: "Arab State — Western Galilee (1947 Plan)" },
        { titel: "Arab State — the highlands (1947 Plan)" },
        { titel: "Arab State — the coast from Isdud to Rafah (1947 Plan)" },
        { titel: "Jerusalem and Bethlehem — international zone (1947 Plan)" }
      ] },
      { label: "Armistice 1949", flaechen: [
        { titel: "Israel within the 1949 armistice lines" },
        { titel: "West Bank — under Jordanian control (1949–1967)" },
        { titel: "Gaza Strip — under Egyptian administration (1949–1967)" }
      ] },
      { label: "after 1967", flaechen: [
        { titel: "Israel within the 1949 lines" },
        { titel: "West Bank and East Jerusalem — occupied since 1967" },
        { titel: "Gaza Strip — occupied in 1967, withdrawal 2005" },
        { titel: "Golan Heights — taken from Syria in 1967" },
        { titel: "Sinai — taken from Egypt in 1967, returned in 1982" }
      ] }
    ],
    bewegungen: [
      { name: "1948: flight and expulsion into the Gaza Strip" },
      { name: "1948: flight and expulsion to the east" },
      { name: "Jewish immigration across the Mediterranean (the Aliyot)" },
      { name: "Jewish refugees from Arab countries after 1948" }
    ],
    punkte: [
      { name: "Jerusalem" },
      { name: "Tel Aviv" },
      { name: "Haifa" },
      { name: "Gaza" },
      { name: "Hebron" },
      { name: "Tiberias on the Sea of Galilee" }
    ],
    beschriftungen: [
      { text: "Mediterranean Sea" },
      { text: "Israel" },
      { text: "West Bank" },
      { text: "Gaza Strip" },
      { text: "Jordan" },
      { text: "Egypt" },
      { text: "Sinai" },
      { text: "Lebanon" },
      { text: "Syria" },
      { text: "Golan Heights" },
      { text: "Negev" },
      { text: "Dead Sea" },
      { text: "Gulf of Aqaba" },
      { text: "Suez Canal" }
    ]
  },
  "germanen": {
    phasen: [
      { label: "around 100 AD", flaechen: [
        { titel: "The Roman Empire in Europe" },
        { titel: "Britain up to Hadrian’s Wall" },
        { titel: "Asia Minor and Syria" },
        { titel: "The African provinces" }
      ] },
      { label: "375–378", flaechen: [
        { titel: "The Roman Empire in Europe" },
        { titel: "Britain up to Hadrian’s Wall" },
        { titel: "Asia Minor and Syria" },
        { titel: "The African provinces" },
        { titel: "The Gothic settlement area north of the Danube" },
        { titel: "The steppe of the Huns — the pressure came from here" }
      ] },
      { label: "406–455", flaechen: [
        { titel: "What the Western Roman Empire still held" },
        { titel: "The Eastern Roman Empire" },
        { titel: "Britain — left to itself by Rome in 407" },
        { titel: "The Visigothic kingdom of Toulouse (since 418)" },
        { titel: "The Vandal kingdom in North Africa (since 439)" },
        { titel: "Attila’s realm (around 450)" }
      ] },
      { label: "around 500", flaechen: [
        { titel: "The Frankish kingdom of Clovis" },
        { titel: "The Visigothic kingdom (Spain and Aquitaine)" },
        { titel: "The Burgundian kingdom on the Rhône" },
        { titel: "The Ostrogothic kingdom of Theoderic (Italy and Dalmatia)" },
        { titel: "The Vandal kingdom in North Africa" },
        { titel: "The Anglo-Saxon kingdoms in Britain" },
        { titel: "The Eastern Roman Empire — it continued to exist" }
      ] },
      { label: "568", flaechen: [
        { titel: "The Frankish kingdom" },
        { titel: "The Visigothic kingdom (Spain and Septimania)" },
        { titel: "The Lombards in Italy (since 568)" },
        { titel: "Ravenna and the south — what the Eastern Roman Empire still held in Italy" },
        { titel: "Sicily — remained Eastern Roman" },
        { titel: "North Africa — reconquered by the Eastern Roman Empire in 534" },
        { titel: "The Anglo-Saxon kingdoms in Britain" },
        { titel: "The Eastern Roman Empire" }
      ] }
    ],
    bewegungen: [
      { name: "Huns" },
      { name: "Goths" },
      { name: "Visigoths" },
      { name: "Vandals" },
      { name: "Angles and Saxons" }
    ],
    punkte: [
      { name: "Teutoburg Forest" },
      { name: "Limes" },
      { name: "Adrianople" },
      { name: "Rome" },
      { name: "Ravenna" },
      { name: "Carthage" }
    ],
    beschriftungen: [
      { text: "Britain" },
      { text: "Gaul" },
      { text: "Germania" },
      { text: "Hispania" },
      { text: "Italy" },
      { text: "North Africa" },
      { text: "Roman Empire" },
      { text: "Pannonia" },
      { text: "Steppe" },
      { text: "Baltic Sea" },
      { text: "North Sea" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "Rhine" },
      { text: "Danube" },
      { text: "Vistula" }
    ]
  },
  "koenigreiche": {
    phasen: [
      { label: "476", flaechen: [
        { titel: "Italy under Odoacer" },
        { titel: "The Visigothic kingdom of Euric — the largest realm of the West" },
        { titel: "The Suebian kingdom in Gallaecia" },
        { titel: "The Vandal kingdom in North Africa" },
        { titel: "The Burgundian kingdom on the Rhône" },
        { titel: "Childeric’s Frankish kingdom — the smallest spot on the map" },
        { titel: "The realm of Syagrius — the last Roman army commander" },
        { titel: "The Anglo-Saxon kingdoms in Britain" },
        { titel: "The Eastern Roman Empire — the emperor still rules there" }
      ] },
      { label: "around 526", flaechen: [
        { titel: "The Frankish kingdom of Clovis’s sons" },
        { titel: "The Ostrogothic kingdom of Theoderic — Italy, Dalmatia, Provence" },
        { titel: "The Visigothic kingdom, confined to Spain after 507" },
        { titel: "The Suebian kingdom in Gallaecia" },
        { titel: "The Burgundian kingdom on the Rhône" },
        { titel: "The Vandal kingdom in North Africa" },
        { titel: "The Anglo-Saxon kingdoms in Britain" },
        { titel: "The Eastern Roman Empire" }
      ] },
      { label: "around 600", flaechen: [
        { titel: "The Merovingian Frankish kingdom — now with Burgundy and Provence" },
        { titel: "The Lombards in Italy (since 568)" },
        { titel: "Ravenna, Rome and the south — the Eastern Roman Italy" },
        { titel: "Sicily — remained Eastern Roman" },
        { titel: "The Visigothic kingdom — the whole peninsula since 585" },
        { titel: "The Exarchate of Carthage" },
        { titel: "The Anglo-Saxon Heptarchy" },
        { titel: "The Eastern Roman Empire" }
      ] },
      { label: "800", flaechen: [
        { titel: "The Empire of Charlemagne" },
        { titel: "The Principality of Benevento — remained Lombard" },
        { titel: "Al-Andalus — since 711" },
        { titel: "Asturias — the Christian north" },
        { titel: "North Africa under the Caliphate" },
        { titel: "The Anglo-Saxon kingdoms" },
        { titel: "Sicily — still Eastern Roman" },
        { titel: "The Eastern Roman Empire" }
      ] }
    ],
    bewegungen: [
      { name: "The Franks (486–507)" },
      { name: "The mission to Britain (596/597)" },
      { name: "Charlemagne to Italy (773/774 and 800)" }
    ],
    punkte: [
      { name: "Reims" },
      { name: "Tours" },
      { name: "Ravenna" },
      { name: "Rome" },
      { name: "Canterbury" },
      { name: "Aachen" },
      { name: "Toledo" }
    ],
    beschriftungen: [
      { text: "Frankish kingdom" },
      { text: "Burgundians" },
      { text: "Visigoths" },
      { text: "Lombards" },
      { text: "Ostrogoths" },
      { text: "Anglo-Saxons" },
      { text: "Saxons" },
      { text: "Bavarians" },
      { text: "Roman Empire (East)" },
      { text: "Britain" },
      { text: "Hispania" },
      { text: "Italy" },
      { text: "North Africa" },
      { text: "North Sea" },
      { text: "Atlantic" },
      { text: "Mediterranean Sea" },
      { text: "Rhine" },
      { text: "Danube" }
    ]
  },
  "mittelalter": {
    phasen: [
      { label: "around 800", flaechen: [
        { titel: "The Empire of Charlemagne" },
        { titel: "The Papal States — Pepin’s Donation to the Pope" },
        { titel: "The Anglo-Saxon kingdoms in Britain" },
        { titel: "The Byzantine Empire — Asia Minor and the Greek coasts" },
        { titel: "Al-Andalus — the Islamic part of the peninsula" },
        { titel: "Asturias — the Christian north" },
        { titel: "The Caliphate — North Africa, Egypt and the Levant" }
      ] },
      { label: "around 1200", flaechen: [
        { titel: "The Holy Roman Empire" },
        { titel: "The Kingdom of France" },
        { titel: "The Kingdom of England" },
        { titel: "The Christian kingdoms of Spain" },
        { titel: "Al-Andalus under the Almohads" },
        { titel: "The Crusader states — a coastal strip after 1187" },
        { titel: "The Byzantine Empire" }
      ] },
      { label: "around 1500", flaechen: [
        { titel: "The Holy Roman Empire" },
        { titel: "The Kingdom of France" },
        { titel: "Spain — united in 1492" },
        { titel: "Portugal — the other route to the East" },
        { titel: "The Kingdom of England" },
        { titel: "The Italian states — Venice, Milan, Florence, Rome, Naples" },
        { titel: "The Ottoman Empire — with Constantinople since 1453" },
        { titel: "Egypt and Syria under the Mamluks" }
      ] },
      { label: "1618", flaechen: [
        { titel: "Predominantly Catholic — Spain, France, Italy, Austria, Poland" },
        { titel: "Predominantly Protestant — northern Germany, Denmark, the Netherlands" },
        { titel: "England and Scotland — under one crown since 1603" },
        { titel: "The Ottoman Empire" },
        { titel: "Egypt and Syria — Ottoman since 1517" }
      ] }
    ],
    bewegungen: [
      { name: "The First Crusade (1096–1099)" },
      { name: "The Black Death (1347–1353)" },
      { name: "Columbus sails west (1492)" },
      { name: "The Reformation spreads north (from 1517)" }
    ],
    punkte: [
      { name: "Aachen" },
      { name: "Canossa" },
      { name: "Jerusalem" },
      { name: "Venice" },
      { name: "Constantinople" },
      { name: "Mainz" },
      { name: "Wittenberg" }
    ],
    beschriftungen: [
      { text: "Frankish kingdom" },
      { text: "Holy Roman Empire" },
      { text: "France" },
      { text: "England" },
      { text: "Spain" },
      { text: "Italy" },
      { text: "Byzantium" },
      { text: "Ottoman Empire" },
      { text: "Egypt" },
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "Atlantic" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "Rhine" },
      { text: "Danube" }
    ]
  },
  "eroberung-amerikas": {
    phasen: [
      { label: "around 1492", flaechen: [
        { titel: "The Aztec Empire — the Triple Alliance of Tenochtitlan, Texcoco and Tlacopan" },
        { titel: "The Inca Empire — Tawantinsuyu, “the four quarters of the world”" },
        { titel: "The crowns of Castile and Aragon" },
        { titel: "The Kingdom of Portugal" }
      ] },
      { label: "1492–1504", flaechen: [
        { titel: "The Aztec Empire — the Triple Alliance of Tenochtitlan, Texcoco and Tlacopan" },
        { titel: "The Inca Empire — Tawantinsuyu" },
        { titel: "Hispaniola — the first Spanish base" },
        { titel: "The crowns of Castile and Aragon" },
        { titel: "The Kingdom of Portugal" }
      ] },
      { label: "1519–1521", flaechen: [
        { titel: "The Aztec Empire — fell in August 1521" },
        { titel: "The Inca Empire — still untouched" },
        { titel: "Cuba — Spanish since 1511" },
        { titel: "Hispaniola — Spanish since 1492" },
        { titel: "The crowns of Castile and Aragon" },
        { titel: "The Kingdom of Portugal" }
      ] },
      { label: "1532–1533", flaechen: [
        { titel: "New Spain — the land the Spanish ruled from 1521" },
        { titel: "The Inca Empire — in civil war in 1532/33, and then lost" },
        { titel: "Cuba" },
        { titel: "Hispaniola" },
        { titel: "The crowns of Castile and Aragon" },
        { titel: "The Kingdom of Portugal" }
      ] },
      { label: "around 1600", flaechen: [
        { titel: "The Viceroyalty of New Spain" },
        { titel: "The Viceroyalty of Peru — to Potosí and beyond" },
        { titel: "Cuba" },
        { titel: "Hispaniola" },
        { titel: "Puerto Rico" },
        { titel: "Portuguese Brazil — a strip along the coast" },
        { titel: "Spain and Portugal — under one crown since 1580" }
      ] }
    ],
    bewegungen: [
      { name: "Columbus across the Atlantic (1492)" },
      { name: "Cortés to Tenochtitlan (1519–1521)" },
      { name: "Pizarro to the Inca (1531–1533)" },
      { name: "The silver from Potosí to Seville (from 1545)" }
    ],
    punkte: [
      { name: "Seville" },
      { name: "Canary Islands" },
      { name: "Guanahani" },
      { name: "Santo Domingo" },
      { name: "Tenochtitlan" },
      { name: "Cusco" }
    ],
    beschriftungen: [
      { text: "Mexico" },
      { text: "Yucatán" },
      { text: "Central America" },
      { text: "Cuba" },
      { text: "Peru" },
      { text: "Andes" },
      { text: "Brazil" },
      { text: "Iberia" },
      { text: "Northwest Africa" },
      { text: "Canaries" },
      { text: "Atlantic Ocean" },
      { text: "Pacific Ocean" },
      { text: "Gulf of Mexico" },
      { text: "Caribbean Sea" },
      { text: "Amazon" }
    ]
  },
  "dreissigjaehriger-krieg": {
    phasen: [
      { label: "1618", flaechen: [
        { titel: "The Habsburg lands — Austria, Bohemia, Moravia, Silesia, Lusatia and Royal Hungary" },
        { titel: "The Kingdom of France" },
        { titel: "The Spanish Netherlands — ruled by Spain, nominally still part of the Empire" },
        { titel: "The Republic of the Seven United Netherlands — in a truce with Spain" },
        { titel: "The Kingdom of Denmark — Jutland, Schleswig and Holstein" },
        { titel: "The Danish islands with Copenhagen" },
        { titel: "Norway, Scania, Halland and Blekinge — the same Danish crown" },
        { titel: "The Kingdom of Sweden" },
        { titel: "Swedish Estonia" },
        { titel: "Poland–Lithuania — with the Duchy of Prussia and Courland as fiefs" }
      ] },
      { label: "1631–1632", flaechen: [
        { titel: "The Habsburg lands" },
        { titel: "The reach of the Swedish armies 1630–1632 — not state territory, but occupied land" },
        { titel: "The Kingdom of Sweden" },
        { titel: "Swedish Livonia and Estonia — secured since 1629" },
        { titel: "The Kingdom of France — not yet at war, but Sweden’s paymaster" },
        { titel: "The Spanish Netherlands" },
        { titel: "The Republic of the Seven United Netherlands — at war with Spain again since 1621" },
        { titel: "The Kingdom of Denmark — out of the war since 1629" },
        { titel: "The Danish islands with Copenhagen" },
        { titel: "Norway, Scania, Halland and Blekinge" },
        { titel: "Poland–Lithuania" }
      ] },
      { label: "1648", flaechen: [
        { titel: "The Habsburg lands — without Lusatia, which fell to Electoral Saxony in 1635" },
        { titel: "Sweden in the Empire — Western Pomerania with Rügen, Wismar, the prince-bishoprics of Bremen and Verden" },
        { titel: "The Kingdom of Sweden" },
        { titel: "Swedish Livonia and Estonia" },
        { titel: "The Kingdom of France — with the Habsburg rights in Alsace" },
        { titel: "The Republic of the Seven United Netherlands — no longer part of the Empire since 1648" },
        { titel: "The Swiss Confederation — released from the Empire in 1648" },
        { titel: "The Spanish Netherlands — Spain continues to fight France" },
        { titel: "The Kingdom of Denmark" },
        { titel: "The Danish islands with Copenhagen" },
        { titel: "Norway, Scania, Halland and Blekinge" },
        { titel: "Poland–Lithuania" }
      ] }
    ],
    bewegungen: [
      { name: "The imperial and Catholic League armies march north (1630/31)" },
      { name: "Gustavus Adolphus in the Empire (1630–1632)" },
      { name: "The French army to Rocroi (1643)" }
    ],
    punkte: [
      { name: "Prague" },
      { name: "Vienna" },
      { name: "Magdeburg" },
      { name: "Breitenfeld" },
      { name: "Lützen" },
      { name: "Münster and Osnabrück" },
      { name: "Rocroi" }
    ],
    beschriftungen: [
      { text: "Bohemia" },
      { text: "Saxony" },
      { text: "Brandenburg" },
      { text: "Pomerania" },
      { text: "Bavaria" },
      { text: "Franconia" },
      { text: "Silesia" },
      { text: "Austria" },
      { text: "Hungary" },
      { text: "Netherlands" },
      { text: "France" },
      { text: "Denmark" },
      { text: "Sweden" },
      { text: "Norway" },
      { text: "Poland–Lithuania" },
      { text: "England" },
      { text: "Switzerland" },
      { text: "Italy" },
      { text: "Baltic Sea" },
      { text: "North Sea" },
      { text: "Atlantic" },
      { text: "Mediterranean Sea" },
      { text: "Adriatic Sea" },
      { text: "Rhine" },
      { text: "Danube" },
      { text: "Elbe" }
    ]
  },
  "usa-unabhaengigkeit": {
    phasen: [
      { label: "1776", flaechen: [
        { titel: "The Thirteen Colonies" },
        { titel: "Spanish North America — Louisiana, Texas, New Mexico and California" },
        { titel: "Land of the Haudenosaunee (Iroquois Confederacy)" },
        { titel: "The nations of the Southeast — Cherokee, Muscogee, Choctaw, Chickasaw, Seminole" }
      ] },
      { label: "1830–1839", flaechen: [
        { titel: "The United States in 1830" },
        { titel: "Mexico — Texas, New Mexico and California" },
        { titel: "Indian Territory (later Oklahoma) — the destination of the forced relocation" }
      ] },
      { label: "1890", flaechen: [
        { titel: "The United States — from sea to sea" },
        { titel: "Indian Territory (later Oklahoma) — until its dissolution in 1907" },
        { titel: "Pine Ridge Reservation (Lakota), founded 1889" }
      ] }
    ],
    bewegungen: [
      { name: "The Trail of Tears (1838/39)" },
      { name: "The Oregon Trail (from the 1840s)" },
      { name: "The California Trail (from 1849)" }
    ],
    punkte: [
      { name: "Boston" },
      { name: "Philadelphia" },
      { name: "New Echota" },
      { name: "New Orleans" },
      { name: "Fort Laramie" },
      { name: "Little Bighorn" },
      { name: "Wounded Knee" }
    ],
    beschriftungen: [
      { text: "Atlantic coast" },
      { text: "Appalachians" },
      { text: "Great Lakes" },
      { text: "Mississippi" },
      { text: "Prairie" },
      { text: "Rocky Mountains" },
      { text: "California" },
      { text: "Gulf of Mexico" },
      { text: "Atlantic Ocean" },
      { text: "Pacific Ocean" },
      { text: "Texas" },
      { text: "Oregon" }
    ]
  },
  "revolution-und-napoleon": {
    phasen: [
      { label: "1789", flaechen: [
        { titel: "The Kingdom of France — with Corsica, French since 1768" },
        { titel: "Great Britain and Ireland" },
        { titel: "The Kingdom of Spain — Bourbons, allied with Paris until 1808" },
        { titel: "The Kingdom of Portugal — England’s oldest ally" },
        { titel: "The Habsburg Monarchy — Austria, Bohemia, Hungary, Galicia" },
        { titel: "The Austrian Netherlands" },
        { titel: "The Duchy of Milan — Habsburg" },
        { titel: "The Republic of the United Netherlands" },
        { titel: "The Kingdom of Prussia — the eastern block and the possessions on the Rhine" },
        { titel: "Poland–Lithuania — after the First Partition of 1772" },
        { titel: "The Russian Empire — the western border runs along the Daugava and the Dnieper" },
        { titel: "The Ottoman Empire — with the principalities of Wallachia and Moldavia" },
        { titel: "The Kingdom of Naples and Sicily — Bourbons" },
        { titel: "The Papal States" },
        { titel: "The Grand Duchy of Tuscany" },
        { titel: "The Kingdom of Sardinia-Piedmont — Savoy, Nice, Piedmont, Sardinia" },
        { titel: "The Republic of Venice — since the 8th century, eight more years to go" },
        { titel: "The Kingdom of Denmark — Jutland, Schleswig and Holstein" },
        { titel: "The Danish islands with Copenhagen" },
        { titel: "The Kingdom of Sweden" }
      ] },
      { label: "1805–1812", flaechen: [
        { titel: "The French Empire — directly annexed territory, with Corsica and the Illyrian Provinces" },
        { titel: "The Kingdom of Italy — Napoleon himself is its king" },
        { titel: "The Kingdom of Naples — ruled by Joachim Murat, Napoleon’s brother-in-law" },
        { titel: "The Confederation of the Rhine — founded in 1806, the end of the Holy Roman Empire" },
        { titel: "The Duchy of Warsaw — for many Poles the hope of a state of their own" },
        { titel: "Switzerland — reorganised in 1803 by the Act of Mediation" },
        { titel: "The Kingdom of Spain under Joseph Bonaparte — dominated, but never pacified" },
        { titel: "The Kingdom of Portugal — with British troops in the country" },
        { titel: "Great Britain and Ireland — never defeated, never reached" },
        { titel: "The Russian Empire — an ally until 1812, then an enemy" },
        { titel: "The Austrian Empire — after the defeats of 1805 and 1809" },
        { titel: "The Kingdom of Prussia — halved after the Peace of Tilsit in 1807" },
        { titel: "The Ottoman Empire — at peace with Russia since May 1812" },
        { titel: "The Kingdom of Sicily — the Bourbons under British protection" },
        { titel: "The Kingdom of Denmark — on Napoleon’s side" },
        { titel: "The Danish islands with Copenhagen" },
        { titel: "The Kingdom of Sweden" }
      ] },
      { label: "1815", flaechen: [
        { titel: "The Kingdom of France — back within the borders of 1792, with Corsica" },
        { titel: "Great Britain and Ireland" },
        { titel: "The Kingdom of the Netherlands — North and South in one state" },
        { titel: "The Kingdom of Prussia — with the Rhineland, Westphalia, Posen and half of Saxony" },
        { titel: "The Austrian Empire — with the new Kingdom of Lombardy–Venetia" },
        { titel: "The remaining states of the German Confederation — Bavaria, Saxony, Hanover, Württemberg and thirty more" },
        { titel: "The Russian Empire — with the Kingdom of Poland under the Tsar" },
        { titel: "The Kingdom of Spain" },
        { titel: "The Kingdom of Portugal" },
        { titel: "The Kingdom of Sardinia-Piedmont — enlarged by Genoa" },
        { titel: "The Grand Duchy of Tuscany" },
        { titel: "The Papal States — restored" },
        { titel: "The Kingdom of the Two Sicilies" },
        { titel: "The Swiss Confederation — declared neutral" },
        { titel: "The Ottoman Empire" },
        { titel: "The Kingdom of Denmark — Norway passed to Sweden in 1814" },
        { titel: "The Danish islands with Copenhagen" },
        { titel: "The Kingdom of Sweden — in union with Norway since 1814" }
      ] }
    ],
    bewegungen: [
      { name: "The advance of the Grande Armée to Moscow (June to September 1812)" },
      { name: "The retreat from Russia (October to December 1812)" },
      { name: "From Elba to Waterloo — the Hundred Days (March to June 1815)" }
    ],
    punkte: [
      { name: "Paris" },
      { name: "Trafalgar" },
      { name: "Madrid" },
      { name: "Austerlitz" },
      { name: "Moscow" },
      { name: "Leipzig" },
      { name: "Waterloo" }
    ],
    beschriftungen: [
      { text: "France" },
      { text: "Spain" },
      { text: "Portugal" },
      { text: "Italy" },
      { text: "Britain" },
      { text: "Ireland" },
      { text: "Russia" },
      { text: "Poland" },
      { text: "Bohemia" },
      { text: "Hungary" },
      { text: "Greece" },
      { text: "Anatolia" },
      { text: "North Africa" },
      { text: "Sweden" },
      { text: "Denmark" },
      { text: "Corsica" },
      { text: "Elba" },
      { text: "Sardinia" },
      { text: "Sicily" },
      { text: "Crimea" },
      { text: "Pyrenees" },
      { text: "Alps" },
      { text: "Carpathians" },
      { text: "Atlantic" },
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "Mediterranean Sea" },
      { text: "Adriatic Sea" },
      { text: "Aegean Sea" },
      { text: "Black Sea" },
      { text: "Rhine" },
      { text: "Neman" },
      { text: "Danube" }
    ]
  },
  "die-kolonien": {
    phasen: [
      { label: "1815", flaechen: [
        { titel: "The United Kingdom — plus the Cape Colony (since 1806), Sierra Leone and the Gambia" },
        { titel: "The territories of the East India Company — Bengal, Madras and Bombay" },
        { titel: "France — plus the trading posts at the mouth of the Senegal: Saint-Louis and Gorée" },
        { titel: "Portugal — plus the coastal territories in Angola and Mozambique" },
        { titel: "Spain" },
        { titel: "The Sultanate of Morocco — independent, with its own embassies in Europe" },
        { titel: "The regencies of Algiers, Tunis and Tripoli — nominally subject to the Sultan, in fact independent" },
        { titel: "Egypt under Muhammad Ali — formally Ottoman, in fact a state of its own" },
        { titel: "The Abyssinian Empire" },
        { titel: "The Sokoto Caliphate — founded in 1804, one of the largest states in the world of its time" },
        { titel: "The Kingdom of Bornu on Lake Chad" },
        { titel: "The Ashanti Empire on the Gold Coast — gold, administration, its own roads" },
        { titel: "The Kingdom of Dahomey" },
        { titel: "The Kingdom of Buganda on Lake Victoria" },
        { titel: "The Merina Kingdom on Madagascar" },
        { titel: "The Sultanate of Oman and Zanzibar — master of the trade of the western Indian Ocean" },
        { titel: "The Sikh Empire under Ranjit Singh in the Punjab" },
        { titel: "The Maratha principalities in central India" },
        { titel: "The Kingdom of Nepal" },
        { titel: "Afghanistan" },
        { titel: "The khanates of Khiva, Bukhara and Kokand" },
        { titel: "Qajar Persia" },
        { titel: "The Ottoman Empire" },
        { titel: "The Russian Empire" }
      ] },
      { label: "1885", flaechen: [
        { titel: "The United Kingdom — plus the Cape Colony, Natal, the Gold Coast, Lagos, Sierra Leone, the Gambia and British Somaliland" },
        { titel: "British India — a crown colony since 1858, plus Lower Burma and Ceylon" },
        { titel: "Egypt — occupied by Britain since 1882, formally still Ottoman" },
        { titel: "France — plus Algeria, Tunisia (since 1881), Senegal, the French Congo and Obock on the Red Sea" },
        { titel: "The Congo Free State — the private property of the Belgian King Leopold II, not a possession of Belgium" },
        { titel: "The Kingdom of Belgium" },
        { titel: "The German Empire — plus the protectorates of 1884/85: South West Africa, Togo, Cameroon and the treaties in East Africa" },
        { titel: "Portugal — plus Angola, Mozambique and Portuguese Guinea" },
        { titel: "Spain — plus Río de Oro (since 1884) and Spanish Guinea" },
        { titel: "Italy — plus Assab and Massawa, the first bases on the Red Sea" },
        { titel: "The Sultanate of Morocco — still independent" },
        { titel: "The Abyssinian Empire" },
        { titel: "The Mahdist State in the Sudan — Khartoum fell in 1885" },
        { titel: "The Sokoto Caliphate" },
        { titel: "The Kingdom of Bornu" },
        { titel: "The Ashanti Empire" },
        { titel: "The Kingdom of Dahomey" },
        { titel: "The empire of Samori Touré — resistance until 1898" },
        { titel: "Liberia — founded as a republic in 1847" },
        { titel: "The Kingdom of Madagascar under the Merina dynasty" },
        { titel: "The Sultanate of Zanzibar — the island and the coastal strip" },
        { titel: "The Kingdom of Buganda" },
        { titel: "The Ndebele kingdom in Matabeleland" },
        { titel: "Barotseland on the upper Zambezi" },
        { titel: "The South African Republic (Transvaal)" },
        { titel: "The Orange Free State" },
        { titel: "Zululand — at war with Britain in 1879, annexed in 1887" },
        { titel: "The Sultanate of Oman" },
        { titel: "The Kingdom of Nepal" },
        { titel: "Afghanistan — a buffer state between two empires" },
        { titel: "Persia" },
        { titel: "The Ottoman Empire" },
        { titel: "The Russian Empire — after the conquest of Central Asia" }
      ] },
      { label: "1914", flaechen: [
        { titel: "The United Kingdom and its territories — Egypt, the Anglo-Egyptian Sudan, East Africa and Uganda, Zanzibar, the Union of South Africa with Rhodesia and Bechuanaland, Nyasaland, Nigeria, the Gold Coast, Sierra Leone, the Gambia, Somaliland and Cyprus" },
        { titel: "British India — the “jewel of the crown”, plus Burma as a province and Ceylon as a crown colony in its own right" },
        { titel: "France and its territories — French West Africa, French Equatorial Africa, Algeria, Tunisia, the Protectorate of Morocco (since 1912), Madagascar and the Somali coast" },
        { titel: "The German Empire and its colonies — German East Africa, German South West Africa, Cameroon and Togo" },
        { titel: "Belgium and the Belgian Congo — administered by the state since 1908, before that the king’s private property" },
        { titel: "Portugal and its colonies — Angola, Mozambique and Portuguese Guinea" },
        { titel: "Italy and its colonies — Libya (since 1912), Eritrea and Italian Somaliland" },
        { titel: "Spain and its territories — Spanish Sahara, Spanish Morocco and Spanish Guinea" },
        { titel: "The Abyssinian Empire — victorious at Adwa in 1896, never colonised" },
        { titel: "Liberia — a republic since 1847, never colonised" },
        { titel: "The Kingdom of Nepal" },
        { titel: "Afghanistan" },
        { titel: "Persia — divided into spheres of influence between Russia and Britain in 1907" },
        { titel: "The Ottoman Empire" },
        { titel: "The Russian Empire" }
      ] }
    ],
    bewegungen: [
      { name: "The old sea route to India — around the Cape (until 1869)" },
      { name: "The short route to India — through the Suez Canal (from 1869)" },
      { name: "The caravan routes into the interior of East Africa" },
      { name: "The rubber from the Congo — to Antwerp" }
    ],
    punkte: [
      { name: "London" },
      { name: "Berlin" },
      { name: "Suez Canal" },
      { name: "Delhi" },
      { name: "Léopoldville" },
      { name: "Cape Town" },
      { name: "Zanzibar" }
    ],
    beschriftungen: [
      { text: "Atlantic" },
      { text: "Indian Ocean" },
      { text: "Mediterranean Sea" },
      { text: "Red Sea" },
      { text: "Persian Gulf" },
      { text: "Gulf of Guinea" },
      { text: "North Sea" },
      { text: "Black Sea" },
      { text: "Caspian Sea" },
      { text: "Arabian Sea" },
      { text: "Sahara" },
      { text: "Kalahari" },
      { text: "Namib" },
      { text: "Congo Basin" },
      { text: "Nile" },
      { text: "Niger" },
      { text: "Zambezi" },
      { text: "Ganges" },
      { text: "Europe" },
      { text: "Arabia" },
      { text: "India" },
      { text: "Anatolia" },
      { text: "Persia" },
      { text: "Central Asia" },
      { text: "Madagascar" },
      { text: "Ceylon" },
      { text: "Canaries" }
    ]
  },
  "weg-zum-ersten-weltkrieg": {
    phasen: [
      { label: "1871", flaechen: [
        { titel: "German Empire" },
        { titel: "Austria-Hungary" },
        { titel: "France" },
        { titel: "The Russian Empire" },
        { titel: "Kingdom of Italy" },
        { titel: "United Kingdom" },
        { titel: "Ottoman Empire (Balkan possessions)" }
      ] },
      { label: "1907", flaechen: [
        { titel: "German Empire — Central Powers" },
        { titel: "Austria-Hungary — Central Powers (with Bosnia-Herzegovina)" },
        { titel: "France — Entente" },
        { titel: "The Russian Empire — Entente" },
        { titel: "Kingdom of Italy — Triple Alliance" },
        { titel: "United Kingdom — Entente" },
        { titel: "Ottoman Empire (Balkan possessions, smaller after 1878)" },
        { titel: "Kingdom of Serbia" }
      ] },
      { label: "1914", flaechen: [
        { titel: "German Empire — Central Powers" },
        { titel: "Austria-Hungary — Central Powers (with Bosnia-Herzegovina)" },
        { titel: "France — Entente" },
        { titel: "The Russian Empire — Entente" },
        { titel: "Kingdom of Italy — Triple Alliance" },
        { titel: "United Kingdom — Entente" },
        { titel: "Ottoman Empire (Eastern Thrace, after the Balkan Wars)" },
        { titel: "Kingdom of Serbia" }
      ] }
    ],
    bewegungen: [
      { name: "The Schlieffen Plan, 1914" },
      { name: "The Russian mobilisation, 1914" },
      { name: "Austria-Hungary’s declaration of war, 1914" }
    ],
    punkte: [
      { name: "Sarajevo" },
      { name: "Vienna" },
      { name: "Berlin" },
      { name: "Belgrade" },
      { name: "St Petersburg" },
      { name: "Paris" },
      { name: "London" }
    ],
    beschriftungen: [
      { text: "Atlantic" },
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "Alps" },
      { text: "Balkans" },
      { text: "German Empire" },
      { text: "France" },
      { text: "Russia" },
      { text: "Austria-Hungary" },
      { text: "Italy" },
      { text: "Serbia" }
    ]
  },
  "usa-weltmacht": {
    phasen: [
      { label: "1890", flaechen: [
        { titel: "The United States — a continental power, in the Pacific only with Alaska (bought in 1867)" },
        { titel: "Canada — a British dominion since 1867" },
        { titel: "Mexico" },
        { titel: "The Kingdom of Hawaii — independent, with a US naval right at Pearl Harbor since 1887" },
        { titel: "The Philippines — a Spanish colony since 1565" },
        { titel: "The Mariana Islands — a Spanish colony" },
        { titel: "The Marshall Islands — a German protectorate since 1885" },
        { titel: "The Empire of Japan — in the Meiji era since 1868" },
        { titel: "The Kingdom of Korea — still independent" },
        { titel: "The Empire of China (Qing) — its borders extend far beyond the left edge of the map" },
        { titel: "The Russian Empire — Siberia, Kamchatka and all of Sakhalin" }
      ] },
      { label: "1917", flaechen: [
        { titel: "The United States and its Pacific territories — Alaska and Midway (1867), Hawaii, Guam and the Philippines (1898), Wake (1899)" },
        { titel: "Canada — a British dominion" },
        { titel: "Mexico" },
        { titel: "The Empire of Japan — with Taiwan (1895), South Sakhalin (1905) and Korea (1910)" },
        { titel: "German island territories occupied by Japan (since 1914) — the Marianas without Guam and the Marshall Islands" },
        { titel: "The Republic of China (since 1911) — it too extends far beyond the left edge of the map" },
        { titel: "Russia — in 1917 the tsarist empire perishes in the revolution; North Sakhalin remains Russian" }
      ] },
      { label: "1945", flaechen: [
        { titel: "The United States and its territories — the Philippines become independent on 4 July 1946" },
        { titel: "Islands administered by the USA — the Marianas and the Marshall Islands (taken in 1944), Iwo Jima and Okinawa (1945)" },
        { titel: "Canada — a British dominion" },
        { titel: "Mexico" },
        { titel: "Japan — capitulated on 2 September 1945 and occupied by the USA" },
        { titel: "Korea north of the 38th parallel — Soviet occupation zone" },
        { titel: "Korea south of the 38th parallel — American occupation zone" },
        { titel: "The Republic of China — Taiwan reverts to China in 1945" },
        { titel: "The Soviet Union — with all of Sakhalin and the Kuril Islands (September 1945)" }
      ] }
    ],
    bewegungen: [
      { name: "Dewey’s squadron to Manila (1898)" },
      { name: "The Japanese carrier fleet to Pearl Harbor (1941)" },
      { name: "Island hopping — the way back (1944/45)" },
      { name: "From Tinian to Hiroshima (6 August 1945)" }
    ],
    punkte: [
      { name: "San Francisco" },
      { name: "Pearl Harbor (Hawaii)" },
      { name: "Manila" },
      { name: "Guam" },
      { name: "Midway" },
      { name: "Hiroshima" },
      { name: "Tokyo" }
    ],
    beschriftungen: [
      { text: "Pacific Ocean" },
      { text: "Bering Sea" },
      { text: "Gulf of Alaska" },
      { text: "Sea of Okhotsk" },
      { text: "Sea of Japan" },
      { text: "East China Sea" },
      { text: "South China Sea" },
      { text: "United States" },
      { text: "Alaska" },
      { text: "Canada" },
      { text: "Mexico" },
      { text: "Hawaii" },
      { text: "Midway" },
      { text: "Wake" },
      { text: "Marshall Islands" },
      { text: "Marianas" },
      { text: "Aleutian Islands" },
      { text: "Kamchatka" },
      { text: "Siberia" },
      { text: "Kuril Islands" },
      { text: "Japan" },
      { text: "Korea" },
      { text: "China" },
      { text: "Taiwan" },
      { text: "Philippines" }
    ]
  },
  "weimar-ns": {
    phasen: [
      { label: "1919", flaechen: [
        { titel: "German Reich — the young republic (borders per the Treaty of Versailles)" },
        { titel: "Occupied Rhineland — Allied occupation since 1919, demilitarised" },
        { titel: "Saar Territory — removed from German administration, League of Nations (1920–1935)" },
        { titel: "Free City of Danzig — under the protection of the League of Nations (since 1920)" },
        { titel: "Memel Territory — separated from the Reich, Allied administration (1920–1923)" },
        { titel: "Republic of Poland (a state of its own again since 1918)" },
        { titel: "Czechoslovakia (since 1918)" },
        { titel: "Republic of Austria (since 1918)" },
        { titel: "Switzerland" },
        { titel: "France (with Alsace-Lorraine, back since 1919)" },
        { titel: "Belgium (with Eupen and Malmedy, since 1920)" },
        { titel: "Luxembourg" },
        { titel: "Netherlands" },
        { titel: "Denmark (with Northern Schleswig, since the 1920 plebiscite)" },
        { titel: "Lithuania (without the Memel Territory)" }
      ] },
      { label: "1924–1929", flaechen: [
        { titel: "German Reich — the Weimar Republic (borders unchanged)" },
        { titel: "Occupied Rhineland — remaining zones after the evacuation of the Cologne zone (1926)" },
        { titel: "Saar Territory — removed from German administration, League of Nations (1920–1935)" },
        { titel: "Free City of Danzig — under the protection of the League of Nations (since 1920)" },
        { titel: "Republic of Poland (a state of its own again since 1918)" },
        { titel: "Czechoslovakia (since 1918)" },
        { titel: "Republic of Austria (with Burgenland, since 1921)" },
        { titel: "Switzerland" },
        { titel: "France (with Alsace-Lorraine, back since 1919)" },
        { titel: "Belgium (with Eupen and Malmedy, since 1920)" },
        { titel: "Luxembourg" },
        { titel: "Netherlands" },
        { titel: "Denmark (with Northern Schleswig, since the 1920 plebiscite)" },
        { titel: "Lithuania (with the Memel Territory, since 1923/24)" }
      ] },
      { label: "1933", flaechen: [
        { titel: "German Reich — as of 30 January 1933 (borders unchanged)" },
        { titel: "Saar Territory — removed from German administration, League of Nations (1920–1935)" },
        { titel: "Free City of Danzig — under the protection of the League of Nations (since 1920)" },
        { titel: "Republic of Poland (a state of its own again since 1918)" },
        { titel: "Czechoslovakia (since 1918)" },
        { titel: "Republic of Austria (with Burgenland, since 1921)" },
        { titel: "Switzerland" },
        { titel: "France (with Alsace-Lorraine, back since 1919)" },
        { titel: "Belgium (with Eupen and Malmedy, since 1920)" },
        { titel: "Luxembourg" },
        { titel: "Netherlands" },
        { titel: "Denmark (with Northern Schleswig, since the 1920 plebiscite)" },
        { titel: "Lithuania (with the Memel Territory, since 1923/24)" }
      ] }
    ],
    bewegungen: [
      { name: "The November Revolution, 1918" },
      { name: "The occupation of the Ruhr, January 1923" },
      { name: "The money press and the inflation of 1923" },
      { name: "The NSDAP’s path from Munich to Berlin, 1923–1933" }
    ],
    punkte: [
      { name: "Weimar" },
      { name: "Berlin" },
      { name: "Munich" },
      { name: "Ruhr area (Essen)" },
      { name: "Cologne" },
      { name: "Leipzig" },
      { name: "Danzig and the Corridor" }
    ],
    beschriftungen: [
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "German Reich" },
      { text: "Prussia" },
      { text: "Bavaria" },
      { text: "East Prussia" },
      { text: "Poland" },
      { text: "Czechoslovakia" },
      { text: "Austria" },
      { text: "France" },
      { text: "Belgium" },
      { text: "Netherlands" },
      { text: "Denmark" },
      { text: "Switzerland" },
      { text: "Sweden" },
      { text: "Hungary" },
      { text: "Italy" },
      { text: "Yugoslavia" },
      { text: "Alps" },
      { text: "Ruhr area" }
    ]
  },
  "zweiter-weltkrieg": {
    phasen: [
      { label: "1939–1941", flaechen: [
        { titel: "German Reich — as of 1941 (with Austria 1938, the Sudetenland 1938, the Memel Territory, Danzig and western Poland 1939)" },
        { titel: "Protectorate of Bohemia and Moravia — under German rule since March 1939" },
        { titel: "General Government — occupied Poland, since October 1939" },
        { titel: "Occupied by Germany (1940/41): Denmark, Norway, the Netherlands, Belgium, Luxembourg, northern France, Yugoslavia, Greece" },
        { titel: "Vichy France — unoccupied from 1940 to November 1942" },
        { titel: "Kingdom of Italy — allied with Germany (Axis, since 1939/40)" },
        { titel: "At war on Germany’s side (1941): Hungary, Romania, Bulgaria, Slovakia, Finland" },
        { titel: "Soviet Union — party to the Hitler–Stalin Pact of 1939, not an ally (borders of June 1941)" },
        { titel: "Great Britain — at war with Germany since 3 September 1939" },
        { titel: "Remained neutral in the war: Sweden, Switzerland, Spain, Portugal, Ireland, Turkey" }
      ] },
      { label: "1942–1944", flaechen: [
        { titel: "German sphere of power — its greatest extent, autumn 1942 (the eastern border is a front line, not a state border)" },
        { titel: "Kingdom of Italy — allied until September 1943, itself a theatre of war afterwards" },
        { titel: "At war on Germany’s side (1942): Hungary, Romania, Bulgaria, Slovakia, Finland" },
        { titel: "Soviet Union — the unoccupied territory (as of November 1942)" },
        { titel: "Great Britain — at war with Germany since 3 September 1939" },
        { titel: "Remained neutral in the war: Sweden, Switzerland, Spain, Portugal, Ireland, Turkey" }
      ] },
      { label: "1945", flaechen: [
        { titel: "Soviet occupation zone (from July 1945)" },
        { titel: "British occupation zone (from July 1945)" },
        { titel: "American occupation zone (from July 1945)" },
        { titel: "French occupation zone (from July 1945)" },
        { titel: "Berlin — administered jointly by all four powers, in the middle of the Soviet zone (from July 1945)" },
        { titel: "Poland (1945 borders) — shifted westwards: the German territories east of the Oder and Neisse came under Polish administration" },
        { titel: "Northern East Prussia with Königsberg — under Soviet administration since 1945" },
        { titel: "Austria — restored in 1945, likewise divided into four occupation zones" },
        { titel: "Countries liberated and occupied by the Red Army (1944/45): Czechoslovakia, Hungary, Romania, Bulgaria, Yugoslavia" },
        { titel: "Countries liberated by the Western Allies (1944/45): France, Belgium, the Netherlands, Luxembourg, Denmark, Norway, Italy, Greece" },
        { titel: "Soviet Union (1945 borders)" },
        { titel: "Great Britain (1945)" },
        { titel: "Remained neutral in the war: Sweden, Switzerland, Spain, Portugal, Ireland, Turkey" }
      ] }
    ],
    bewegungen: [
      { name: "The invasion of Poland, 1 September 1939" },
      { name: "The advance to Stalingrad, 1941–1942" },
      { name: "The landing in Normandy, 6 June 1944" },
      { name: "Flight and expulsion, 1944/45" }
    ],
    punkte: [
      { name: "Berlin" },
      { name: "Stalingrad" },
      { name: "Auschwitz" },
      { name: "London" },
      { name: "Paris" },
      { name: "Leningrad" },
      { name: "Dresden" }
    ],
    beschriftungen: [
      { text: "Atlantic" },
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "Caspian Sea" },
      { text: "German Reich" },
      { text: "France" },
      { text: "Great Britain" },
      { text: "Ireland" },
      { text: "Spain" },
      { text: "Portugal" },
      { text: "Italy" },
      { text: "Poland" },
      { text: "Soviet Union" },
      { text: "Ukraine" },
      { text: "Belarus" },
      { text: "Finland" },
      { text: "Sweden" },
      { text: "Norway" },
      { text: "Denmark" },
      { text: "Netherlands" },
      { text: "Belgium" },
      { text: "Switzerland" },
      { text: "Austria" },
      { text: "Hungary" },
      { text: "Romania" },
      { text: "Yugoslavia" },
      { text: "Bulgaria" },
      { text: "Greece" },
      { text: "Turkey" },
      { text: "North Africa" }
    ]
  },
  "kalter-krieg": {
    phasen: [
      { label: "1949", flaechen: [
        { titel: "NATO in Europe (founded 4 April 1949)" },
        { titel: "Federal Republic of Germany (founded 1949) — not yet a NATO member" },
        { titel: "German Democratic Republic (founded 1949)" },
        { titel: "West Berlin — administered by the USA, Great Britain and France (1949)" },
        { titel: "East Berlin — Soviet sector, capital of the GDR from 1949" },
        { titel: "Soviet Union" },
        { titel: "In the Soviet sphere of influence (1949): Poland, Czechoslovakia, Hungary, Romania, Bulgaria" },
        { titel: "Albania — in the Soviet sphere of influence in 1949" },
        { titel: "Yugoslavia — belonging to no bloc since the break with Moscow in 1948" },
        { titel: "Greece and Turkey — recipients of the Truman Doctrine since 1947, joining NATO in 1952" },
        { titel: "Austria — still occupied by the four victor powers (until 1955)" },
        { titel: "Spain — a dictatorship under Franco, not a NATO member (1949)" },
        { titel: "Neutral and non-aligned states (1949): Sweden, Finland, Switzerland, Ireland" }
      ] },
      { label: "1961/62", flaechen: [
        { titel: "NATO in Europe (1961) — with Greece and Turkey since 1952" },
        { titel: "Federal Republic of Germany — NATO member since 1955" },
        { titel: "German Democratic Republic — Warsaw Pact since 1955" },
        { titel: "West Berlin — enclosed by the Wall since 13 August 1961" },
        { titel: "East Berlin — Soviet sector, capital of the GDR from 1949" },
        { titel: "Soviet Union — Warsaw Pact" },
        { titel: "Warsaw Pact (founded 14 May 1955): Poland, Czechoslovakia, Hungary, Romania, Bulgaria" },
        { titel: "Albania — at odds with Moscow since 1961, leaning towards China" },
        { titel: "Yugoslavia — co-founder of the Non-Aligned Movement in 1961" },
        { titel: "Austria — neutral since the State Treaty of 1955" },
        { titel: "Spain — a dictatorship under Franco, with US bases since 1953" },
        { titel: "Neutral and non-aligned states (1961): Sweden, Finland, Switzerland, Ireland" }
      ] },
      { label: "1989–1991", flaechen: [
        { titel: "NATO in Europe (1991)" },
        { titel: "Germany — reunified since 3 October 1990" },
        { titel: "Berlin — the Wall has been open since 9 November 1989" },
        { titel: "Soviet Union — dissolved on 25 December 1991" },
        { titel: "Estonia, Latvia and Lithuania — independent again in 1991" },
        { titel: "Former Warsaw Pact — dissolved on 1 July 1991: Poland, Czechoslovakia, Hungary, Romania, Bulgaria" },
        { titel: "Albania — the isolation comes to an end in 1990/91" },
        { titel: "Yugoslavia — the disintegration begins in 1991" },
        { titel: "Austria — neutral" },
        { titel: "Spain — NATO member since 1982" },
        { titel: "Neutral and non-aligned states (1991): Sweden, Finland, Switzerland, Ireland" }
      ] }
    ],
    bewegungen: [
      { name: "The Berlin Airlift, 1948/49" },
      { name: "The flight movement out of the GDR, until 1961" },
      { name: "The route through Hungary, 1989" },
      { name: "The withdrawal of the Soviet troops, 1991–1994" }
    ],
    punkte: [
      { name: "Berlin" },
      { name: "Bonn" },
      { name: "Moscow" },
      { name: "Prague" },
      { name: "Leipzig" },
      { name: "Budapest" },
      { name: "Helsinki" }
    ],
    beschriftungen: [
      { text: "Atlantic" },
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "NATO" },
      { text: "Warsaw Pact" },
      { text: "Iron Curtain" },
      { text: "Neutral states" },
      { text: "Soviet Union" },
      { text: "Yugoslavia" },
      { text: "Alps" }
    ]
  },
  "russland-westen": {
    phasen: [
      { label: "1999 — the first eastern enlargement", flaechen: [
        { titel: "NATO in Europe (1999) — with Poland, Czechia and Hungary since 12 March 1999" },
        { titel: "Russian Federation (1999)" },
        { titel: "Russian Federation (1999) — a second layer of the same area, so that it appears darker than the NATO states" },
        { titel: "Ukraine (1999) — independent since 24 August 1991, with Crimea" },
        { titel: "Belarus (1999) — independent since 1991" },
        { titel: "Estonia, Latvia and Lithuania (1999) — independent, not yet in NATO" },
        { titel: "Georgia (1999) — independent since 1991" }
      ] },
      { label: "2014 — Crimea and Donbas", flaechen: [
        { titel: "NATO in Europe (2014) — with Estonia, Latvia, Lithuania, Slovakia, Slovenia, Romania and Bulgaria since 2004, with Albania and Croatia since 2009" },
        { titel: "Russian Federation (2014)" },
        { titel: "Russian Federation (2014) — a second layer of the same area, so that it appears darker than the NATO states" },
        { titel: "Crimea — annexed by Russia since March 2014; under international law still Ukraine (UN Resolution 68/262 of 27 March 2014)" },
        { titel: "Areas controlled by separatists in Donetsk and Luhansk (as of the end of 2014) — under international law Ukraine" },
        { titel: "Ukraine (2014) — state territory without the annexed Crimea" },
        { titel: "Belarus (2014)" },
        { titel: "Georgia — Abkhazia and South Ossetia have been outside Tbilisi’s control since the war of August 2008" }
      ] },
      { label: "2022–2024 — the war of aggression and the Nordic enlargement", flaechen: [
        { titel: "NATO in Europe (2024) — with Montenegro since 2017, with North Macedonia since 2020, with Finland since 2023 and with Sweden since 2024" },
        { titel: "Russian Federation (2024)" },
        { titel: "Russian Federation (2024) — a second layer of the same area, so that it appears darker than the NATO states" },
        { titel: "Crimea — annexed by Russia since March 2014; under international law still Ukraine (UN Resolution 68/262 of 27 March 2014)" },
        { titel: "Territories of Ukraine occupied by Russia (approximate status 2024) — under international law Ukraine" },
        { titel: "Ukraine — the part controlled by Kyiv (approximate status 2024)" },
        { titel: "Belarus (2022) — one of the attack routes to Kyiv led from here in February 2022" },
        { titel: "Georgia — Abkhazia and South Ossetia have been outside Tbilisi’s control since the war of August 2008" }
      ] }
    ],
    bewegungen: [
      { name: "The first eastern enlargement, 1999" },
      { name: "The great enlargement, 2004" },
      { name: "The attack on Kyiv, February 2022" },
      { name: "Finland and Sweden join, 2023 and 2024" }
    ],
    punkte: [
      { name: "Moscow" },
      { name: "Kyiv (Kiev)" },
      { name: "Brussels" },
      { name: "Sevastopol" },
      { name: "Warsaw" },
      { name: "Tbilisi (Tiflis)" },
      { name: "Helsinki" }
    ],
    beschriftungen: [
      { text: "Atlantic" },
      { text: "North Sea" },
      { text: "Baltic Sea" },
      { text: "Mediterranean Sea" },
      { text: "Black Sea" },
      { text: "Caspian Sea" },
      { text: "NATO" },
      { text: "Russia" },
      { text: "Ukraine" },
      { text: "Belarus" },
      { text: "Caucasus" }
    ]
  },
  "aufstieg-asiens": {
    phasen: [
      { label: "1955–1968 — reconstruction and the economic miracle", flaechen: [
        { titel: "The European Economic Community (1957) — France, Italy, the Federal Republic, Belgium, the Netherlands and Luxembourg; together around a fifth of the world economy" },
        { titel: "Federal Republic of Germany (mid-1960s) — the world’s second-largest economy after the USA; a second layer of the same area, so that it appears darker" },
        { titel: "German Democratic Republic (1955–1968) — a planned economy in the Council for Mutual Economic Assistance; it belongs to the other half of the story told in the chapter “The New World Order and the Cold War”" },
        { titel: "Japan (1955–1968) — around 9 per cent growth per year; 1964 the Olympic Games in Tokyo and the first Shinkansen, in 1968 Japan overtakes the Federal Republic" },
        { titel: "Republic of Korea (1961) — around 100 dollars of economic output per capita, poorer than Ghana; the catch-up process only begins in these years" },
        { titel: "Taiwan (1960s) — land reform and the first export industry; the island is governed from Taipei, the People’s Republic of China claims it" },
        { titel: "Hong Kong (1960s) — British crown colony; textile and toy factories (drawn larger than it is)" },
        { titel: "Singapore (1965) — independent since 9 August 1965, without raw materials and with the port as its only capital (drawn larger than it is)" },
        { titel: "People’s Republic of China (1958–1961) — the “Great Leap Forward” ends in a famine with millions of deaths; the reforms only begin in 1978" },
        { titel: "India (1965) — a planned economy and around 3.5 per cent growth per year; in 1966 the country has to import grain to avert a famine" }
      ] },
      { label: "1990 — Japan’s peak and the Four Tigers", flaechen: [
        { titel: "The six founding states of the European Community (1990) — with a united Germany since 3 October 1990; the EC has twelve members at this time, the six of 1957 are drawn here" },
        { titel: "Japan (1990) — the world’s second-largest economy since 1968; a second layer of the same area, so that it appears darker" },
        { titel: "Japan (1990) — around 14 per cent of the world economy; on 29 December 1989 the Nikkei index reaches 38,915 points, then the bubble bursts" },
        { titel: "Republic of Korea (1990) — around 6,500 dollars per capita; 1987 the first free presidential elections, 1988 the Olympic Games in Seoul" },
        { titel: "Taiwan (1990) — the Hsinchu Science Park carries a new industry, the contract manufacturer TSMC was founded in 1987; the island is governed from Taipei, the People’s Republic of China claims it" },
        { titel: "Hong Kong (1990) — British crown colony and financial centre; the factories have long since moved across the border to Shenzhen" },
        { titel: "Singapore (1990) — over 12,000 dollars per capita; from developing country to industrial state within one generation" },
        { titel: "People’s Republic of China (1990) — twelve years after the start of Deng Xiaoping’s reforms: around 2 per cent of the world economy and around 330 dollars per capita" },
        { titel: "India (1990) — on the eve of the 1991 reforms; the foreign exchange reserves cover only a few weeks of imports" }
      ] },
      { label: "2024 — the new weights", flaechen: [
        { titel: "The six founding states of the European Union (2024) — they stand here for Western Europe; the Union now has 27 members and together accounts for around a sixth of the world economy. With around 4.7 trillion dollars, Germany is the world’s third-largest economy" },
        { titel: "People’s Republic of China (2024) — the world’s second-largest economy since 2010; a second layer of the same area, so that it appears darker" },
        { titel: "People’s Republic of China (2024) — around 18 trillion dollars of economic output, around a sixth of the world economy; per capita that is around 13,000 dollars, a quarter of the German value" },
        { titel: "Japan (2024) — the world’s fourth-largest economy; after 1990 came around three decades with barely any growth, with life expectancy still high and unemployment low" },
        { titel: "India (2024) — the world’s fifth-largest economy and, since 2023, the most populous country; around 2,700 dollars per capita" },
        { titel: "Republic of Korea (2024) — around 36,000 dollars per capita, most recently above the Japanese figure; at the same time the world’s lowest birth rate" },
        { titel: "Taiwan (2024) — around 90 per cent of the world’s most advanced semiconductors are made here; the island is governed from Taipei, the People’s Republic of China claims it" },
        { titel: "Hong Kong (2024) — a Special Administrative Region of the People’s Republic of China since 1 July 1997 (drawn larger than it is)" },
        { titel: "Singapore (2024) — one of the highest gross domestic products per capita in the world (drawn larger than it is)" },
        { titel: "Vietnam (2024) — the new workbench: factories moving out of China often go here" }
      ] }
    ],
    bewegungen: [
      { name: "The Marshall Plan, 1948–1952" },
      { name: "The workbench moves: Japan → South Korea and Taiwan (1960s–1980s)" },
      { name: "And on to China: the special economic zones from 1980" },
      { name: "What comes from Asia to Europe — the route of the containers" }
    ],
    punkte: [
      { name: "Frankfurt am Main" },
      { name: "Tokyo" },
      { name: "Seoul" },
      { name: "Taipei" },
      { name: "Shenzhen" },
      { name: "Mumbai" },
      { name: "Singapore" }
    ],
    beschriftungen: [
      { text: "Atlantic" },
      { text: "Mediterranean Sea" },
      { text: "North Sea" },
      { text: "Black Sea" },
      { text: "Red Sea" },
      { text: "Indian Ocean" },
      { text: "Bay of Bengal" },
      { text: "South China Sea" },
      { text: "Pacific Ocean" },
      { text: "Sahara" },
      { text: "Siberia" },
      { text: "Himalayas" },
      { text: "Europe" },
      { text: "Asia" }
    ]
  },
};
