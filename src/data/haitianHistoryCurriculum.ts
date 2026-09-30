import { ComprehensionQA, GradeLevel, HistoricalDateItem, HistoricalFigureItem, VocabularyItem } from '../types';

export const ISTWA_DAYITI_CHAPTERS_BY_GRADE: Record<GradeLevel, string[]> = {
  'Grade 7': [
    'Entwodiksyon nan Istwa D Ayiti: Metòd Istorik, Sous ak Kronoloji',
    'Jewografi Istorik Zile Ayiti (Quisqueya / Bohío) anvan 1492',
    'Premye Pèp Endijèn yo: Siboney (Guanahatabey) ak Migrasyon Arawak yo',
    'Sivilizasyon Taíno sou Zile Ayiti: Òganizasyon Sosyal ak Vi Kominotè',
    'Senk Kasika Zile Ayiti yo (Marién, Maguá, Maguana, Jaragua, Higüey) ak Kasik yo',
    'Ekonomi ak Agrikilti Taíno: Konkou (Conuco), Manyòk, Kasav, Lapèch ak Atizana',
    'Relijyon, Zemi, Mitoloji ak Seremoni Areíto nan Kilti Taíno',
    'Ewòp nan Finisman 15yèm Syèk la ak Premye Vwayaj Kristòf Kolon (1492)',
    'Debakman 5 Desanm 1492 nan Mòl Sen Nikola ak Konstriksyon Fò La Navidad',
    'Premye Rezistans Endijèn nan: Kasik Caonabo ak Destriksyon La Navidad (1493)',
    'Kolonizasyon Panyòl: Sistèm Repartimiento, Encomienda ak Eksplwatasyon Lò',
    'Rezistans Rèn Anacaona nan Jaragua ak Kasik Cotubanamá nan Higüey',
    'Soulèvman Kasik Hatuey ak Lagè Rezistans Enriquillo nan Mòn Bahoruco (1519–1533)',
    'Chit Demografik Taíno yo, Bartolomé de las Casas ak Premye Esklav Afriken yo (1503)',
    'Arive Flibistye, Boukanye ak Abitan Franse sou Zile Latòti (Île de la Tortue)',
    'Bertrand d’Ogeron, Kreyasyon Koloni Saint-Domingue ak Trete Ryswick (1697)',
  ],
  'Grade 8': [
    'Saint-Domingue nan 18yèm Syèk la: Òganizasyon Administratif ak Militè Koloni an',
    'Ekonomi Plantasyon nan Saint-Domingue: Sik, Kafe, Digo, Koton ak Kakao',
    'Trèt Nègriyè Transatlantik la: Soti sou Kòt Lafrik rive nan "Passage du Milieu"',
    'Sistèm Eksklizif Komèsyal la (Pacte Colonial) ak Richès Metwopòl Fransèz la',
    'Kòd Nwa (Code Noir 1685): Lwa Kolonyal ak Reyalite sou Habitation yo',
    'Estratifikasyon Sosyal nan Saint-Domingue: Gran Blan ak Ti Blan',
    'Klas Afranchi yo (Gens de couleur libres): Pwopriyete, Prejije Koulè ak Lwa Diskriminatwa',
    'Kondisyon Lavi ak Travay Moun Esklav yo: Esklav Domestik, Atizan ak Esklav Jaden',
    'Kilti, Lang Kreyòl ak Vodou kòm Espas Rezistans ak Solidarite nan Koloni an',
    'Mawonaj la (Le Marronnage): Kominote Mawon nan Mòn Bahoruco, Padrejean ak Plymouth',
    'François Mackandal ak Gran Konplo kont Sistèm Esklavajis la (1757–1758)',
    'Revolisyon Fransèz 1789 la ak Enpak Deklarasyon Dwa Moun sou Saint-Domingue',
    'Lit Politik Blan Kolon yo (Klib Massiac) kont Sosyete Zanmi Nwa yo',
    'Revòlt Vincent Ogé ak Jean-Baptiste Chavannes pou Egalite Dwa Politik (1790–1791)',
    'Seremoni Bwa Kayiman (14 Out 1791): Dutty Boukman, Cécile Fatiman ak Sèman Libète a',
    'Lensireksyon Jeneral Out 1791 nan Plèn di Nò ak Premye Chèf Endijèn yo (Boukman, Biassou, Jean-François)',
  ],
  'Grade 9': [
    'Komisyon Sivil Franse yo (Sonthonax ak Polverel) ak Kriz Kolonyal 1792–1793 la',
    'Pwoklamasyon Libète Jeneral nan Saint-Domingue (29 Out 1793) ak Dekrè 4 Fevriye 1794 la',
    'Monte Toussaint Louverture: Soti nan Habitation Bréda rive nan Chèf Lame Endijèn nan',
    'Revirman Toussaint Louverture an favè Repiblik Fransèz la (1794) ak Trete Basel (1795)',
    'Viktwa Toussaint Louverture sou Okipasyon Anglèz la (1798) ak Asansyon Politik li',
    'Lagè Sid la (Lagè Kouto, 1799–1800): Konfli ant Toussaint Louverture ak André Rigaud',
    'Inifikasyon Zile a (Janvye 1801), Regleman Kilti ak Konstitisyon 1801 Toussaint Louverture la',
    'Napoléon Bonaparte ak Ekspedisyon Militè Jeneral Charles Leclerc (Fevriye 1802)',
    'Lagè Rezistans 1802 la: Batay Ravine-à-Couleuvres ak Ewoyis Crête-à-Pierrot (Dessalines, Lamartinière, Marie-Jeanne)',
    'Arestasyon Toussaint Louverture nan Ennery/Gonaïves (7 Jen 1802) ak Lanmò li nan Fort de Joux (7 Avril 1803)',
    'Retablisman Esklavaj nan Gwadloup (Me 1802) ak Repriz Lagè Endepandans lan an Oktòb 1802',
    'Kongrè Arcahaie (18 Me 1803): Inite Dessalines–Pétion ak Kreyasyon Drapo Ble ak Wouj la (Catherine Flon)',
    'Kanpay Final Lame Endijèn nan kont Rochambeau: Nicolas Geffrard, Gabart, Clerveaux ak Capois-la-Mort',
    'Batay Vètyè (18 Novanm 1803): Viktwa Desizif Lame Endijèn nan ak Kapitilasyon Franse yo',
    'Pwoklamasyon Endepandans Ayiti nan Gonayiv (1ye Janvye 1804) ak Akt Endepandans Boisrond-Tonnerre',
    'Gouvènman Jean-Jacques Dessalines (Anperè Jacques Ier): Konstitisyon 1805, Verifikasyon Tè yo ak Pont-Rouge (17 Oktòb 1806)',
  ],
  'Grade 10': [
    'Kriz Politik apre 17 Oktòb 1806, Konstitisyon Desanm 1806 ak Batay Sibert (1ye Janvye 1807)',
    'Divizyon Politik Ayiti (1807–1820): Eta/Wayòm Nò Henri Christophe ak Repiblik Sid Alexandre Pétion',
    'Gouvènman Henri Christophe (Wa Henry Ier) nan Nò: Code Henry, Ekonomi ak Enstriksyon Piblik',
    'Patrimwàn Monumental Wayòm Nò a: Citadelle Laferrière ak Palè Sans-Souci nan Milot',
    'Prezidans Alexandre Pétion nan Repiblik Sid la: Konstitisyon 1816 ak Distribisyon Tè bay Sòlda yo',
    'Solidarite Entènasyonal Ayiti: Èd Alexandre Pétion bay Simón Bolívar pou Liberasyon Amerik Latin',
    'Prezidans Jean-Pierre Boyer (1818–1843): Reyinifikasyon Nò ak Sid (1820) ak Inifikasyon Zile a (1822–1844)',
    'Òdonans Wa Charles X (17 Avril 1825) ak Dèt Endepandans 150 Milyon Fran a: Enpak sou Ekonomi Nasyonal la',
    'Kòd Riral 1826 Boyer a, Rezistans Peyizan ak Fòmasyon Sistèm Lakou ann Ayiti',
    'Revolisyon Praslin (1843), Konstitisyon Liberal 1843 ak Separasyon Pati Lès Zile a (1844)',
    'Mouvman Peyizan "Lame Soufrans" (Pikè yo) avèk Jean-Jacques Acaau nan Sid (1844)',
    'Politik Doubli (Politique de Doublure, 1843–1847): Rivière Hérard, Guerrier, Pierrot ak Riché',
    'Faustin Soulouque (Anperè Faustin Ier, 1847–1859): Pouvwa Enperyal ak Kanpay Militè yo',
    'Prezidans Fabre Nicolas Geffrard (1859–1867): Konkòda 1860 ak Devlopman Lekòl ak Lise yo',
    'Sylvain Salnave (1867–1869), Lagè Sivil Kakos/Piquets ak Prezidans Nissage Saget (1870–1874)',
    'Pati Liberal ak Pati Nasyonal (Edmond Paul, Boyer Bazelais, Louis Joseph Janvier, Anténor Firmin) sou Salomon ak Hyppolite (1879–1896)',
  ],
  'Grade 11': [
    'Ayiti nan Kòmansman 20yèm Syèk la: Tirésias Simon Sam, Anténor Firmin ak Nord Alexis (1902–1908)',
    'Santenè Endepandans Ayiti (1904) ak Refleksyon Entelektyèl Jenerasyon La Ronde la',
    'Kriz Politik ak Finansye Epòk Efmèd yo (1911–1915): Leconte, Tancrède Auguste, Oreste ak Vilbrun Guillaume Sam',
    'Debakman Militè Ameriken an (28 Jiyè 1915) ak Siyati Konvansyon Ayisyano-Amerikèn 1915 la',
    'Estrikti Okipasyon Amerikèn nan (1915–1934): Konstitisyon 1918, Jandamri d’Ayiti ak Travay Fòse Kòve a',
    'Rezistans Ame Kako yo kont Okipasyon an: Charlemagne Péralte (1919) ak Benoît Batraville (1920)',
    'Rezistans Patriyotik ak Kiltirèl: Union Patriotique, Georges Sylvain ak Mouvman Endijenis (Jean Price-Mars, 1928)',
    'Grèv Etidyan Damien, Masak Marchaterre (6 Desanm 1929), Komisyon Forbes ak Retou Gouvènman Ayisyen',
    'Prezidans Sténio Vincent (1930–1941): Finisman Okipasyon an ("Dezyèm Endepandans", Out 1934) ak Masak 1937 la',
    'Prezidans Élie Lescot (1941–1946): Ayiti nan Dezyèm Gè Mondyal la ak Kanpay "Anti-Superstitieuse"',
    'Mouvman Sosyal ak Revolisyon Janvye 1946 la ("Les Cinq Glorieuses"): Etidyan, Laprès (La Ruche) ak Sendika yo',
    'Prezidans Dumarsais Estimé (1946–1950): Refòm Sosyal, Lwa Travay ak Ekspozisyon Entènasyonal Bicentenaire Pòtoprens (1949)',
    'Prezidans Paul Eugène Magloire (1950–1956): Travay Enfrastrikti (Peligr), Siklòn Hazel (1954) ak Dwa Vòt Fanm yo',
    'Peryòd François Duvalier (1957–1971) ak Jean-Claude Duvalier (1971–1986): Pouvwa Politik, Ekonomi ak Egzil',
    'Mouvman Popilè Demokratik yo ak Evènman 7 Fevriye 1986 la',
    'Konstitisyon 29 Mas 1987 la: Dwa Fondamantal, Enstitisyon Demokratik, Desantralizasyon ak Ko-ofisyalizasyon Kreyòl Ayisyen',
  ],
  'Grade 12': [
    'Istoriografi Ayisyèn: Soti nan Pyonye 19yèm Syèk yo (Thomas Madiou, Beaubrun Ardouin) rive nan Istoriografi Kontanporen an',
    'Analiz Kritik Sous Istorik ak Deba Istoriografik sou Revolisyon Ayisyen an (Michel-Rolph Trouillot, Jean Casimir, Gérard Barthélemy)',
    'Portée Inivèsèl Revolisyon Ayisyen an (1804) nan Istwa Dwa Moun, Abolisyonis ak Dekolonizasyon Mondyal',
    'Istwa Konstitisyonèl Konpare Ayiti (1801–1987): Evolisyon Leta, Rejim Politik ak Sitwayènte',
    'Istwa Ekonomik Ayiti sou Long Peryòd: Soti nan Sistèm Plantasyon rive nan Ekonomi Peyizan ak Pwa Dèt 1825 la',
    'Transformasyon Ekonomik nan 20yèm ak 21yèm Syèk: Endistri Sou-Tretans, Sektè Enfòmèl ak Transfè Dyaspora',
    'Istwa Sosyal Ayiti: Dinamik Klas Sosyal, Rapò Vil–Mòn ("Peyi Andeyò") ak Urbanizasyon Akselere',
    'Istwa Lang ak Idantite Nasyonal: Kreyòl Ayisyen ak Fransè nan Sistèm Edikatif (Refòm Bernard 1979) ak nan Leta',
    'Relijyon, Kwayans ak Tradisyon nan Sosyete Ayisyèn: Vodou, Katolisis (Konkòda 1860) ak Pwotestantis',
    'Istwa Kiltirèl ak Atistik Ayiti: Penti (Centre d’Art 1944), Literati, Mizik ak Patrimwàn Mondyal UNESCO',
    'Wòl Fanm nan Istwa Ayiti: Soti nan Anacaona, Cécile Fatiman, Marie-Jeanne ak Catherine Flon rive nan Ligue Féminine d’Action Sociale (1934)',
    'Istwa Migrasyon ak Dyaspora Ayisyèn nan: Kiba, Repiblik Dominikèn, Etazini, Kanada, Lafrans ak Amerik di Sid',
    'Istwa Diplomasi ak Relasyon Entènasyonal Ayiti: Panamerikanis, SDN, ONU (Émile Saint-Lot 1948), OEA ak CARICOM',
    'Tranzisyon Politik ak Defi Demokratik ann Ayiti soti nan 1986 rive nan Kòmansman 21yèm Syèk la',
    'Tranblemandtè 12 Janvye 2010 la ak Siklòn Matthew (2016): Enpak Sosyal, Ekonomik ak Defi Rekonstriksyon Nasyonal',
    'Eritaj Istorik Ayiti, Memwa Sivik ak Responsablite Jenerasyon Jodi a pou Konstriksyon yon Leta de Dwa Dirab',
  ],
};

const GRADE_HISTORICAL_CORPUS: Record<
  GradeLevel,
  {
    periodSummary: string;
    dates: HistoricalDateItem[];
    figures: HistoricalFigureItem[];
    vocabularyPool: VocabularyItem[];
    historiography: string;
  }
> = {
  'Grade 7': {
    periodSummary:
      'Peryòd Pre-Kolonbyen (Taíno / Arawak), Konkèt Panyòl (1492–16yèm syèk) ak Etablisman Franse (1625–1697)',
    dates: [
      {
        date: 'Anvan 1492',
        event:
          'Sivilizasyon Taíno / Arawak òganize an 5 kasika (Marién, Maguá, Maguana, Jaragua, Higüey) sou zile Ayiti / Quisqueya / Bohío.',
      },
      {
        date: '5 desanm 1492',
        event:
          'Kristòf Kolon debake nan Mòl Sen Nikola sou zile Ayiti epi li batize zile a La Española.',
      },
      {
        date: '25 desanm 1492',
        event:
          'karavèl Santa María chwe sou kòt Nò a; Kolon konstwi fò La Navidad nan kasika Marién avèk èd kasik Guacanagaríx.',
      },
      {
        date: 'Novanm 1493',
        event:
          'Kasik Caonabo ak rebèl Taíno yo detwi fò La Navidad pou reponn kont abi garnizon panyòl la.',
      },
      {
        date: '1503',
        event:
          'Gouvènè Nicolás de Ovando fè masakre kasik yo nan Jaragua, fè pandye Rèn Anacaona, epi premye gwoup Afriken esklav rive sou zile a.',
      },
      {
        date: '1519–1533',
        event:
          'Lagè rezistans Kasik Enriquillo (Guarocuya) nan mòn Bahoruco kont kolon panyòl yo.',
      },
      {
        date: '1625 & 1665',
        event:
          'Enstalasyon boukanye ak flibistye franse sou Zile Latòti (1625) epi nominasyon Bertrand d’Ogeron kòm gouvènè (1665).',
      },
      {
        date: '20 septanm 1697',
        event:
          'Siyati Trete Ryswick kote Espay rekonèt ofisyèlman souverènte Lafrans sou pati lwès zile a (Saint-Domingue).',
      },
    ],
    figures: [
      {
        name: 'Rèn Anacaona (1474–1503)',
        role: 'Kasik Jaragua, powèt (areíto) ak senbòl rezistans pèp Taíno a devan kolonizasyon panyòl.',
      },
      {
        name: 'Kasik Caonabo',
        role: 'Kasik Maguana ki te dirije premye atak kont fò La Navidad an 1493 pou defann souverènte endijèn nan.',
      },
      {
        name: 'Kasik Enriquillo (Guarocuya)',
        role: 'Lidè Taíno ki te mennen yon rezistans ame pandan 14 ane (1519–1533) nan mòn Bahoruco jiskaske Espay siyen yon trete lapè.',
      },
      {
        name: 'Guacanagaríx, Bohechío, Guarionex ak Cayacoa (Cotubanamá)',
        role: 'Dirijan istorik senk kasika Taíno yo sou zile Ayiti an 1492.',
      },
      {
        name: 'Bartolomé de las Casas (1484–1566)',
        role: 'Frè dominiken ki te denonse masak ak abi sistèm Encomienda a sou popilasyon Taíno a.',
      },
      {
        name: 'Bertrand d’Ogeron (1613–1676)',
        role: 'Premye gouvènè franse (1665) ki te òganize sedantarizasyon abitan ak kolon franse yo nan Latòti ak nan Lwès.',
      },
    ],
    vocabularyPool: [
      {
        term: 'Kasika / Caciquat / Caciquedom',
        definitionHt: 'Teritwa politik ak sosyal sou zile Ayiti pre-kolonbyen ki te dirije pa yon chèf yo te rele Kasik (Cacique).',
        definitionFr: 'Territoire politique et social de l’île d’Haïti précolombienne gouverné par un Cacique.',
        definitionEn: 'Political and territorial chiefdom on pre-Columbian Hispaniola/Ayiti governed by a Cacique.',
      },
      {
        term: 'Encomienda / Sistèm Encomienda',
        definitionHt: 'Sistèm kolonyal panyòl ki te fòse Taíno yo travay nan min lò ak nan jaden anba lòd kolon yo.',
        definitionFr: 'Système colonial espagnol soumettant les autochtones Taïnos au travail forcé dans les mines et plantations.',
        definitionEn: 'Spanish colonial labor system forcing indigenous Taíno populations into gold mining and agricultural servitude.',
      },
      {
        term: 'Areíto & Zemi / Rites Taïnos',
        definitionHt: 'Areíto se te seremoni chant ak dans istorik Taíno yo; Zemi se te reprezantasyon fòs espirityèl ak zansèt yo.',
        definitionFr: 'L’Areíto désigne les cérémonies chantées de mémoire historique taïno ; le Zemi représente les esprits ancestraux.',
        definitionEn: 'Areíto were communal Taíno historical song-and-dance ceremonies; Zemis were sacred spiritual figures.',
      },
    ],
    historiography:
      'Nòt Istoriografik (Prèv & Sous): Istoryen yo remake estimasyon popilasyon Taíno an 1492 varye selon sous kolonyal yo (Bartolomé de las Casas) ak rechèch akeyolojik modèn yo (ant plizyè santèn mil ak plis pase yon milyon abitan). Nan ASLA, nou prezante diferans sous sa yo avèk prekosyon ak rigè syantifik san nou pa prezante yon sèl chif kòm verite absoli.',
  },
  'Grade 8': {
    periodSummary:
      'Koloni Saint-Domingue (1697–1791): Ekonomi Plantasyon, Trèt Nègriyè, Kòd Nwa, Mawonaj ak Seremoni Bwa Kayiman',
    dates: [
      {
        date: 'Mas 1685',
        event:
          'Wa Louis XIV pibliye Kòd Nwa (Code Noir) pou reglemante esklavaj nan koloni franse yo.',
      },
      {
        date: '20 janvye 1758',
        event:
          'Egzekisyon chèf mawon François Mackandal sou plas piblik Okap (Cap-Français) apre gran rezo rezistans li a.',
      },
      {
        date: '14 jiyè & 26 out 1789',
        event:
          'Revolisyon Fransèz ak Deklarasyon Dwa Moun ak Sitwayen an ki kreye gwo deba politik nan Saint-Domingue.',
      },
      {
        date: 'Oktòb 1790 – Fevriye 1791',
        event:
          'Mouvman ame Vincent Ogé ak Jean-Baptiste Chavannes pou revandike egalite dwa politik afranchi yo.',
      },
      {
        date: '14 out 1791',
        event:
          'Seremoni istorik Bwa Kayiman nan Nò avèk Dutty Boukman ak Cécile Fatiman ki sele sèman libète a.',
      },
      {
        date: '22–23 out 1791',
        event:
          'Deklanchman lensireksyon jeneral esklav yo nan Plèn di Nò (Acul, Limbé, Plaine-du-Nord).',
      },
    ],
    figures: [
      {
        name: 'François Mackandal (mouri an 1758)',
        role: 'Chèf mawon ki te òganize yon gwo rezo rezistans kont sistèm plantasyon kolonyal la nan Nò.',
      },
      {
        name: 'Dutty Boukman (mouri an novanm 1791)',
        role: 'Lidè Seremoni Bwa Kayiman (14 out 1791) ak premye dirijan soulèvman jeneral esklav yo nan Plèn di Nò.',
      },
      {
        name: 'Cécile Fatiman',
        role: 'Manbo ak figi istorik santral nan Seremoni Bwa Kayiman le 14 out 1791.',
      },
      {
        name: 'Vincent Ogé (1755–1791) ak Jean-Baptiste Chavannes (1748–1791)',
        role: 'Lidè afranchi ki te goumen an 1790–1791 kont diskriminasyon kolonyal epi ki te mouri sou wou Okap.',
      },
      {
        name: 'Padrejean (1676) ak Plymouth',
        role: 'Premye chèf mawon ki te mennen rezistans ame nan Nòdwès ak nan mòn koloni an.',
      },
      {
        name: 'Jean-François Papillon ak Georges Biassou',
        role: 'Premye jeneral soulèvman out 1791 la nan Nò Saint-Domingue.',
      },
    ],
    vocabularyPool: [
      {
        term: 'Mawonaj / Le Marronnage / Maroonage',
        definitionHt: 'Aksyon moun esklav ki te kite plantasyon kolonyal yo pou al bati kominote lib nan mòn yo epi òganize rezistans.',
        definitionFr: 'Fuite et résistance organisée des captifs quittant les plantations pour former des communautés libres dans les mornes.',
        definitionEn: 'Flight and armed resistance of enslaved people escaping plantations to establish autonomous mountain communities.',
      },
      {
        term: 'Eksklizif Kolonyal / Pacte Colonial / Mercantile Exclusif',
        definitionHt: 'Règ komèsyal ki te oblije koloni Saint-Domingue vann ak achte machandiz sèlman avèk metwopòl Lafrans.',
        definitionFr: 'Régime économique obligeant la colonie à commercer exclusivement avec la métropole française.',
        definitionEn: 'Mercantilist system restricting Saint-Domingue to trade exclusively with metropolitan France.',
      },
      {
        term: 'Afranchi / Gens de couleur libres / Free People of Color',
        definitionHt: 'Klas sosyal moun nwa ak milat ki te lib nan Saint-Domingue men ki te sibi lwa diskriminatwa kolonyal yo.',
        definitionFr: 'Groupe social de personnes libres noires et métisses soumises à des restrictions civiques sous le régime colonial.',
        definitionEn: 'Class of free Black and mixed-race individuals in Saint-Domingue who faced legal discrimination despite owning property.',
      },
    ],
    historiography:
      'Nòt Istoriografik (Prèv & Sous): Sou Seremoni Bwa Kayiman (out 1791), istoryen tankou Jean Fouchard, Carolyn Fick ak David Geggus konpare temwayaj epòk la (Antoine Dalmas, Hérard Dumesle) pou distenge rasanbleman 14 out nan Lenormand de Mézy ak seremoni lannwit 21–22 out 1791 la. Prezantasyon pridan sous sa yo montre kijan planifikasyon politik ak espirityèl soulèvman an te fèt an etap.',
  },
  'Grade 9': {
    periodSummary:
      'Revolisyon Ayisyen an (1791–1804), Toussaint Louverture, Jean-Jacques Dessalines, Batay Vètyè ak Endepandans Ayiti',
    dates: [
      {
        date: '29 out 1793',
        event:
          'Komisè sivil Léger-Félicité Sonthonax pwoklame abolisyon esklavaj nan Nò Saint-Domingue anba presyon rezistans ame a.',
      },
      {
        date: '4 fevriye 1794 (16 Pluviôse An II)',
        event:
          'Konvansyon Nasyonal Fransèz la vote abolisyon esklavaj nan tout koloni franse yo.',
      },
      {
        date: 'Jiyè 1801',
        event:
          'Toussaint Louverture pibliye Konstitisyon 1801 an ki konfime abolisyon esklavaj pou tout tan epi ki tabli otonomi politik zile a.',
      },
      {
        date: 'Fevriye – Mas 1802',
        event:
          'Debakman ekspedisyon Jeneral Charles Leclerc la ak batay ewoyik Ravine-à-Couleuvres (23 fevriye) ak Crête-à-Pierrot (4–24 mas 1802).',
      },
      {
        date: '7 jen 1802 & 7 avril 1803',
        event:
          'Arestasyon Toussaint Louverture nan Gonaïves/Ennery (7 jen 1802) ak lanmò li nan prizon Fort de Joux nan Jura, Lafrans (7 avril 1803).',
      },
      {
        date: '18 me 1803',
        event:
          'Kongrè Arcahaie: Inifikasyon fòs Dessalines ak Pétion anba kòmandman Dessalines epi kreyasyon drapo ble ak wouj la (Catherine Flon).',
      },
      {
        date: '18 novanm 1803',
        event:
          'Viktwa desizif Lame Endijèn nan nan Batay Vètyè toupre Okap kont lame Jeneral Rochambeau.',
      },
      {
        date: '1ye janvye 1804',
        event:
          'Pwoklamasyon ofisyèl Endepandans Ayiti sou Plas Zam Gonayiv pa Jean-Jacques Dessalines ak lekti Akt Endepandans Boisrond-Tonnerre.',
      },
      {
        date: '20 me 1805 & 17 oktòb 1806',
        event:
          'Piblikasyon Konstitisyon Enperyal 1805 la epi asasina Anperè Jacques Ier (Dessalines) nan Pont-Rouge le 17 oktòb 1806.',
      },
    ],
    figures: [
      {
        name: 'Toussaint Louverture (1743–1803)',
        role: 'Prekisè Endepandans Ayiti, jeneral an chèf Saint-Domingue ak otè Konstitisyon 1801 an.',
      },
      {
        name: 'Jean-Jacques Dessalines (1758–1806)',
        role: 'Jeneral an chèf Lame Endijèn nan, Fondatè Endepandans Ayiti (1ye janvye 1804) ak Premye Chèf Leta (Anperè Jacques Ier).',
      },
      {
        name: 'Alexandre Pétion (1770–1818)',
        role: 'Jeneral ki te fè alyans istorik avèk Dessalines nan Oktòb 1802 ak nan Kongrè Arcahaie (Me 1803) pou ini Nwa ak Milat.',
      },
      {
        name: 'Catherine Flon',
        role: 'Patriyòt ayisyèn ki te koud premye drapo ble ak wouj la nan Arcahaie an me 1803.',
      },
      {
        name: 'François Capois (Capois-la-Mort)',
        role: 'Ofisye 9yèm Demi-Brigad ki te mennen aso ewoyik sou mòn Charrier pandan Batay Vètyè le 18 novanm 1803.',
      },
      {
        name: 'Louis Boisrond-Tonnerre (1776–1806)',
        role: 'Sekretè Dessalines ki te redije Akt Endepandans 1ye janvye 1804 la nan Gonayiv.',
      },
      {
        name: 'Sanité Bélair, Marie-Jeanne Lamartinière ak Claire Heureuse',
        role: 'Fanm vanyan ki te patisipe nan lagè endepandans lan ak nan fondasyon nasyon ayisyèn nan.',
      },
    ],
    vocabularyPool: [
      {
        term: 'Lame Endijèn / Armée Indigène / Indigenous Army',
        definitionHt: 'Non ofisyèl lame liberasyon ki te ini ansyen nouvo lib ak ansyen lib anba kòmandman Jean-Jacques Dessalines pou kreye Ayiti.',
        definitionFr: 'Armée de libération nationale dirigée par Jean-Jacques Dessalines ayant vaincu l’expédition française à Vertières.',
        definitionEn: 'National liberation army commanded by Jean-Jacques Dessalines that won Haitian independence in 1803–1804.',
      },
      {
        term: 'Akt Endepandans / Acte de l’Indépendance / Act of Independence',
        definitionHt: 'Dokiman fondatè Eta Ayisyen an ki te li sou Plas Zam Gonayiv le 1ye janvye 1804 ak deviz "Vivre libre ou mourir".',
        definitionFr: 'Texte fondateur de l’État d’Haïti proclamé aux Gonaïves le 1er janvier 1804.',
        definitionEn: 'Founding proclamation of the sovereign State of Haiti read at Gonaïves on January 1, 1804.',
      },
      {
        term: 'Verifikasyon Tit Pwopriyete / Vérification des Titres',
        definitionHt: 'Politik agra Jean-Jacques Dessalines te lanse pou verifye tit tè yo epi reprann domèn kolonyal yo pou Leta.',
        definitionFr: 'Politique agraire de Dessalines visant à contrôler la légitimité des titres fonciers après 1804.',
        definitionEn: 'Agrarian policy initiated by Dessalines to audit land titles and reclaim former colonial estates for the nation.',
      },
    ],
    historiography:
      'Nòt Istoriografik (Prèv & Sous): Istoryen yo analize avèk presizyon wòl konplemantè Toussaint Louverture (òganizasyon Leta ak lame disipline an 1801) ak Jean-Jacques Dessalines (endepandans total ak ripti definitif avèk sistèm kolonyal la an 1804), toutpandan yo raple kontribisyon desizif mas peyizan ak bòs mawon yo.',
  },
  'Grade 10': {
    periodSummary:
      'Ayiti nan 19yèm Syèk (1807–1896): Sisyon Nò/Sid, Boyer, Dèt 1825, Sistèm Lakou ak Pati Politik yo',
    dates: [
      {
        date: '1807–1820',
        event:
          'Sisyon politik ant Eta/Wayòm Nò (Henri Christophe) ak Repiblik Sid/Lwès (Alexandre Pétion).',
      },
      {
        date: '1816',
        event:
          'Revizyon Konstitisyon 1816 Pétion an (Atik 44 sou asil ak libète) ak èd militè bay Simón Bolívar nan Jakmèl ak Okay.',
      },
      {
        date: '1820 & Fevriye 1822',
        event:
          'Jean-Pierre Boyer reyinifye Nò ak Sid (1820) epi inifye tout zile a (1822–1844).',
      },
      {
        date: '17 avril 1825',
        event:
          'Òdonans wa Lafrans Charles X ki enpoze yon dèt 150 milyon fran lò sou Ayiti anba menas eskad militè Baron de Mackau.',
      },
      {
        date: 'Me 1826',
        event:
          'Piblikasyon Kòd Riral Jean-Pierre Boyer a ak devlopman Sistèm Lakou peyizan an kòm espas otonomi.',
      },
      {
        date: '1843–1844',
        event:
          'Revolisyon Praslin kont Boyer ak mouvman peyizan Pikè yo ("Lame Soufrans") avèk Jean-Jacques Acaau nan Sid.',
      },
      {
        date: '28 mas 1860',
        event:
          'Siyati Konkòda 1860 la ant gouvènman Fabre Geffrard ak Vatikan pou devlopman lekòl ann Ayiti.',
      },
      {
        date: '1879–1896',
        event:
          'Deba ideyolojik ant Pati Liberal ak Pati Nasyonal epi gouvènman Lysius Salomon ak Florvil Hyppolite.',
      },
    ],
    figures: [
      {
        name: 'Henri Christophe (Wa Henry Ier, 1767–1820)',
        role: 'Chèf Leta nan Nò ki te pibliye Code Henry, bati Citadelle Laferrière, Palè Sans-Souci, ak yon rezo lekòl nasyonal.',
      },
      {
        name: 'Alexandre Pétion (1770–1818)',
        role: 'Premye Prezidan Repiblik la nan Sid/Lwès, inisyatè premye distribisyon tè bay sòlda ak peyizan epi alye Simón Bolívar.',
      },
      {
        name: 'Jean-Pierre Boyer (1776–1850)',
        role: 'Prezidan Ayiti (1818–1843) ki te dirije reyinifikasyon peyi a epi ki te siyen akò 1825 la ak Kòd Riral 1826 la.',
      },
      {
        name: 'Jean-Jacques Acaau (mouri an 1846)',
        role: 'Lidè mouvman peyizan "Lame Soufrans" (Pikè yo) nan Sid an 1844 ki te revandike tè pou peyizan ak edikasyon piblik.',
      },
      {
        name: 'Fabre Nicolas Geffrard (1806–1878)',
        role: 'Prezidan (1859–1867) ki te ankouraje enstriksyon piblik, Lekòl Medsin, Lekòl Dwa ak filati koton.',
      },
      {
        name: 'Edmond Paul, Boyer Bazelais, Louis Joseph Janvier ak Anténor Firmin',
        role: 'Gran pansè ak bòs lide Pati Liberal ak Pati Nasyonal nan dezyèm mwatye 19yèm syèk la.',
      },
    ],
    vocabularyPool: [
      {
        term: 'Dèt Endepandans 1825 / La Double Dette de 1825',
        definitionHt: 'Indemnite 150 milyon fran (redui a 90 milyon an 1838) plis prè bankè Lafrans te enpoze sou Ayiti an 1825.',
        definitionFr: 'Indemnité financière de 150 millions de francs imposée par l’ordonnance de Charles X en 1825, assortie d’emprunts bancaires.',
        definitionEn: 'The 150-million-franc indemnity and accompanying French bank loans imposed on Haiti by King Charles X in 1825.',
      },
      {
        term: 'Sistèm Lakou / Le Système du Lakou',
        definitionHt: 'Òganizasyon familyal, agrikòl ak solidarite kominotè peyizan ayisyen yo te bati nan 19yèm syèk la pou pwoteje libète yo.',
        definitionFr: 'Structure sociale, familiale et agricole autonome développée par la paysannerie haïtienne au XIXe siècle.',
        definitionEn: 'Autonomous family-based agrarian and social community system developed by the Haitian peasantry in the 19th century.',
      },
      {
        term: 'Politik Doubli / Politique de Doublure',
        definitionHt: 'Pratik politik nan mitan 19yèm syèk la (1843–1847) kote yon elit politik te mete jeneral aje sou pouvwa pou gouvène dèyè yo.',
        definitionFr: 'Pratique politique (1843–1847) consistant à placer à la présidence des généraux âgés contrôlés par des groupes politiques.',
        definitionEn: 'Mid-19th-century political practice of installing elderly generals as figurehead presidents.',
      },
    ],
    historiography:
      'Nòt Istoriografik (Prèv & Sous): Sou dèt endepandans 1825 la (150 milyon fran redui a 90 milyon an 1838), rechèch ekonomik ak istorik montre kijan "dèt doub" sa a (indemnité plis prè labank franse) te drene resous Leta ayisyen an epi anpeche envestisman nan lekòl ak enfrastrikti pandan plis pase yon syèk.',
  },
  'Grade 11': {
    periodSummary:
      '20yèm Syèk Ayiti: Okipasyon Amerikèn (1915–1934), Rezistans Kako, Endijenis, 1946, Duvalier ak Konstitisyon 1987',
    dates: [
      {
        date: '28 jiyè 1915',
        event:
          'Debakman Marines Ameriken yo (USS Washington) nan Pòtoprens; kòmansman Okipasyon Amerikèn nan (1915–1934).',
      },
      {
        date: '31 oktòb / 1ye novanm 1919',
        event:
          'Asasina chèf rezistans Kako Charlemagne Péralte pa fòs okipasyon yo; Benoît Batraville kontinye lit la jiska me 1920.',
      },
      {
        date: '1928',
        event:
          'Jean Price-Mars pibliye "Ainsi parla l’Oncle", liv fondatè mouvman Endijenis ayisyen an.',
      },
      {
        date: '6 desanm 1929',
        event:
          'Masak Marchaterre (Okay) pandan manifestasyon peyizan ak grèv etidyan Damien yo.',
      },
      {
        date: 'Out 1934',
        event:
          'Depa dènye twoup okipasyon Amerikèn yo sou prezidans Sténio Vincent ("Dezyèm Endepandans").',
      },
      {
        date: 'Janvye 1946 & Out 1946',
        event:
          'Mouvman "Cinq Glorieuses" kont Élie Lescot epi eleksyon prezidan Dumarsais Estimé.',
      },
      {
        date: '1957–1986',
        event:
          'Peryòd gouvènman François Duvalier (1957–1971) ak Jean-Claude Duvalier (1971–1986), jiska 7 fevriye 1986.',
      },
      {
        date: '29 mas 1987',
        event:
          'Referandòm popilè ki adopte Konstitisyon 1987 la (Kreyòl Ayisyen ak Fransè ko-ofisyèl, desantralizasyon ak dwa fondamantal).',
      },
    ],
    figures: [
      {
        name: 'Charlemagne Péralte (1886–1919) ak Benoît Batraville (1877–1920)',
        role: 'Chèf mouvman rezistans ame Kako yo pou defann souverènte nasyonal pandan Okipasyon Amerikèn 1915 la.',
      },
      {
        name: 'Jean Price-Mars (1876–1969)',
        role: 'Etnològ, diplomat ak ekriven ("Ainsi parla l’Oncle") ki te valorize eritaj afriken ak kilti popilè ayisyèn.',
      },
      {
        name: 'Georges Sylvain (1866–1925)',
        role: 'Powèt, jiris ak fondatè "Union Patriotique" (1915) pou mennen lit diplomatik ak legal kont Okipasyon an.',
      },
      {
        name: 'Sténio Vincent (1874–1959)',
        role: 'Prezidan Ayiti (1930–1941) ki te negosye finisman Okipasyon Amerikèn nan an out 1934.',
      },
      {
        name: 'Dumarsais Estimé (1900–1953)',
        role: 'Prezidan (1946–1950) ki te reyalize refòm sosyal, lwa sou salè minimòm ak Bicentenaire Pòtoprens (1949).',
      },
      {
        name: 'Paul Eugène Magloire (1907–2001)',
        role: 'Prezidan (1950–1956) sou ki fanm ayisyèn te jwenn dwa vòt epi travay baraj Peligr te kòmanse.',
      },
    ],
    vocabularyPool: [
      {
        term: 'Kòve / La Corvée / Forced Corvée Labor',
        definitionHt: 'Sistèm travay fòse fòs okipasyon ameriken yo te reaktive baze sou Kòd Riral 1864 la pou fè peyizan konstwi wout.',
        definitionFr: 'Régime de travail forcé imposé aux paysans haïtiens durant l’Occupation américaine pour la construction des routes.',
        definitionEn: 'Forced road-building labor system imposed on Haitian peasants during the U.S. Occupation, sparking the Caco uprising.',
      },
      {
        term: 'Endijenis / Le Mouvement Indigéniste / Indigenism',
        definitionHt: 'Mouvman entelektyèl ak literè ayisyen nan ane 1920 yo ki te defann valè kilti popilè, Kreyòl ak rasin afriken Ayiti.',
        definitionFr: 'Mouvement culturel et littéraire haïtien réhabilitant l’héritage africain et la culture populaire face à l’Occupation.',
        definitionEn: 'Haitian intellectual and literary movement championing African heritage, folklore, and national identity.',
      },
      {
        term: 'Konstitisyon 1987 / La Constitution de 1987',
        definitionHt: 'Lwa-manman demokratik pèp ayisyen an te vote le 29 mas 1987 ki garanti dwa moun, separasyon pouvwa ak Kreyòl kòm lang ofisyèl.',
        definitionFr: 'Charte fondamentale adoptée par référendum le 29 mars 1987 instaurant un régime démocratique décentralisé.',
        definitionEn: 'Democratic constitution overwhelmingly ratified on March 29, 1987 establishing fundamental rights and Kreyòl as co-official.',
      },
    ],
    historiography:
      'Nòt Istoriografik (Prèv & Sous): Istoryen tankou Roger Gaillard, Suzy Castor ak Hans Schmidt analize Okipasyon Amerikèn nan (1915–1934) nan doub dimansyon li: santralizasyon administratif ak sanitè nan Pòtoprens dlonkote, ak pèt souverènte nasyonal, travay fòse kòve a ak represyon kont Kako yo dlòtbò.',
  },
  'Grade 12': {
    periodSummary:
      'Istoriografi Avanse, Ekonomi, Kilti, Lang, Relijyon, Dyaspora, 20yèm–21yèm Syèk ak Eritaj Istorik Ayiti nan Mond lan',
    dates: [
      {
        date: '1847–1860',
        event:
          'Piblikasyon premye gran travay istoriografi nasyonal yo pa Thomas Madiou ("Histoire d’Haïti") ak Beaubrun Ardouin ("Études sur l’Histoire d’Haïti").',
      },
      {
        date: '1885',
        event:
          'Anténor Firmin pibliye "De l’égalité des races humaines" an repons syantifik kont teyori rasis Arthur de Gobineau yo.',
      },
      {
        date: '3 mas 1934',
        event:
          'Fondasyon "Ligue Féminine d’Action Sociale" (Madeleine Sylvain-Bouchereau, Alice Garoute, Fernande Bellegarde) pou dwa sivil ak politik fanm.',
      },
      {
        date: '10 desanm 1948',
        event:
          'Anbasadè ayisyen Émile Saint-Lot jwe yon wòl kle kòm rapòtè nan adopsyon Deklarasyon Inivèsèl Dwa Moun nan ONU (Pari).',
      },
      {
        date: 'Septanm 1979',
        event:
          'Refòm Joseph C. Bernard ki adopte òtograf ofisyèl Kreyòl Ayisyen an epi entegre l kòm lang ansèyman nan lekòl.',
      },
      {
        date: '1982',
        event:
          'UNESCO enskri Parc National Historique (Citadelle Laferrière, Palè Sans-Souci, Ramiers) kòm Patrimwàn Mondyal Limanite.',
      },
      {
        date: '12 janvye 2010',
        event:
          'Gwo tranblemandtè ki frape rejyon Lwès ak Sidès Ayiti; elan solidarite nasyonal ak dyaspora a pou rekonstriksyon peyi a.',
      },
    ],
    figures: [
      {
        name: 'Thomas Madiou (1814–1884) ak Beaubrun Ardouin (1796–1865)',
        role: 'Fondatè istoriografi ayisyèn nan 19yèm syèk la ki te rasanble achiv ak temwayaj sou Revolisyon an.',
      },
      {
        name: 'Anténor Firmin (1850–1911)',
        role: 'Antwopològ, jiris ak moun leta ki te defann egalite tout ras imen nan mond lan ak modernizasyon enstitisyonèl Ayiti.',
      },
      {
        name: 'Madeleine Sylvain-Bouchereau (1905–1970)',
        role: 'Sosyòlòg, edikatris ak pyonye mouvman dwa fanm ann Ayiti ("Haïti et ses femmes").',
      },
      {
        name: 'Émile Saint-Lot (1904–1976)',
        role: 'Senatè ak diplomat ayisyen, rapòtè Deklarasyon Inivèsèl Dwa Moun nan Nasyonzini an 1948.',
      },
      {
        name: 'Michel-Rolph Trouillot (1949–2012)',
        role: 'Antwopològ ak istoryen ("Silencing the Past", "Ti Difé Boulé sou Istoua Ayiti", "Les racines historiques de l’État duvaliérien").',
      },
      {
        name: 'Jean Casimir, Suzy Castor ak Gérard Barthélemy',
        role: 'Chèchè kontanporen sou "Sistèm Lakou", "Peyi Andeyò", souverènte popilè ak istwa sosyal Ayiti.',
      },
    ],
    vocabularyPool: [
      {
        term: 'Istoriografi / Historiographie / Historiography',
        definitionHt: 'Etid syantifik ak kritik sou fason istoryen yo ekri istwa a, sous yo itilize, ak evolisyon entèpretasyon istorik yo.',
        definitionFr: 'Étude critique des sources, des méthodes et des courants d’écriture de l’histoire.',
        definitionEn: 'Critical study of historical sources, methodologies, and the evolution of historical writing.',
      },
      {
        term: 'Dyaspora Ayisyèn / La Diaspora Haïtienne / Haitian Diaspora',
        definitionHt: 'Ansanm kominote ayisyèn ki ap viv aletranje epi ki kenbe lyen kiltirèl, sosyal ak ekonomik aktif avèk Ayiti.',
        definitionFr: 'Ensemble des communautés haïtiennes établies à l’étranger contribuant à la vie culturelle et économique nationale.',
        definitionEn: 'Global Haitian communities living abroad who maintain strong cultural, civic, and economic ties to Haiti.',
      },
      {
        term: 'Patrimwàn Istorik / Patrimoine Historique / Historical Heritage',
        definitionHt: 'Eritaj materyèl (moniman tankou Citadelle Laferrière) ak imateryèl (lang Kreyòl, soupye, mizik, memwa 1804) pèp ayisyen an.',
        definitionFr: 'Héritage matériel et immatériel témoignant de l’histoire et de l’identité du peuple haïtien.',
        definitionEn: 'Tangible and intangible historical legacy of the Haitian nation.',
      },
    ],
    historiography:
      'Nòt Istoriografik (Prèv & Sous): Nan nivo Grade 12 (Philo), elèv la konpare analiz "Leta kont Nasyon" (Michel-Rolph Trouillot) ak teyori "Moun Andeyò / Kominote Lakou" (Jean Casimir, Gérard Barthélemy) pou konprann evolisyon sosyo-politik Ayiti avèk balans kritik e san tonbe nan senplifikasyon.',
  },
};

export function getHaitianHistoryDetailsForChapter(
  grade: GradeLevel,
  chapterNumber: number,
  chapterTitle: string
): {
  importantDates: HistoricalDateItem[];
  historicalFigures: HistoricalFigureItem[];
  historiographyNote: string;
  comprehensionQuestions: ComprehensionQA[];
} {
  const gInfo = GRADE_HISTORICAL_CORPUS[grade];
  const d1 = gInfo.dates[(chapterNumber - 1) % gInfo.dates.length];
  const d2 = gInfo.dates[chapterNumber % gInfo.dates.length];
  const d3 = gInfo.dates[(chapterNumber + 1) % gInfo.dates.length];

  const f1 = gInfo.figures[(chapterNumber - 1) % gInfo.figures.length];
  const f2 = gInfo.figures[chapterNumber % gInfo.figures.length];
  const f3 = gInfo.figures[(chapterNumber + 1) % gInfo.figures.length];

  return {
    importantDates: [d1, d2, d3],
    historicalFigures: [f1, f2, f3],
    historiographyNote: gInfo.historiography,
    comprehensionQuestions: [
      {
        question: `Ki kontèks istorik ak dat kle (${d1.date}) ki pèmèt nou konprann Chapit ${chapterNumber} ("${chapterTitle}") nan nivo ${grade}?`,
        answer: `Nan kad "${gInfo.periodSummary}", dat ${d1.date} (${d1.event}) ak ${d2.date} (${d2.event}) montre enchaînman evènman ki te mennen nan "${chapterTitle}".`,
      },
      {
        question: `Ki wòl pèsonaj istorik tankou ${f1.name} ak ${f2.name} te jwe nan peryòd sa a?`,
        answer: `${f1.name} (${f1.role}) ak ${f2.name} (${f2.role}) te aji kòm aktè premye plan nan transfòmasyon politik ak sosyal epòk la.`,
      },
      {
        question: `Poukisa li enpòtan pou nou apiye sou prèv ak sous istorik lè n ap etidye "${chapterTitle}"?`,
        answer: `${gInfo.historiography}`,
      },
    ],
  };
}

export function getHaitianHistoryDetailsForLesson(
  grade: GradeLevel,
  chapterNumber: number,
  chapterTitle: string,
  lessonNumber: number,
  lessonFocus: string
) {
  const gInfo = GRADE_HISTORICAL_CORPUS[grade];
  const datePair: HistoricalDateItem[] = [
    gInfo.dates[(chapterNumber - 1) % gInfo.dates.length],
    gInfo.dates[(chapterNumber + lessonNumber - 2) % gInfo.dates.length],
  ];
  const figurePair: HistoricalFigureItem[] = [
    gInfo.figures[(chapterNumber - 1) % gInfo.figures.length],
    gInfo.figures[(chapterNumber + lessonNumber - 2) % gInfo.figures.length],
  ];

  const comprehensionQuestions: ComprehensionQA[] = [
    {
      question: `Eksplike kijan dat ${datePair[0].date} (${datePair[0].event}) konekte dirèkteman ak sijè Leson ${chapterNumber}.${lessonNumber} ("${chapterTitle}").`,
      answer: `Dat ${datePair[0].date} la se yon repè kronolojik fondamantal ki eksplike kòz ak devlopman "${chapterTitle}" nan peryòd "${gInfo.periodSummary}".`,
    },
    {
      question: `Ki kontribisyon egzak ${figurePair[0].name} ak ${figurePair[1].name} nan evènman istorik nou etidye nan leson sa a?`,
      answer: `${figurePair[0].name} (${figurePair[0].role}) ak ${figurePair[1].name} (${figurePair[1].role}) te pran desizyon oswa mennen aksyon ki te make peryòd sa a nan istwa Ayiti.`,
    },
    {
      question: `Ki prekosyon metodolojik yon elèv ${grade} dwe pran lè sous istorik yo prezante diferans sou yon evènman?`,
      answer: `Elèv la pa dwe envante dat oswa enfòmasyon; li dwe konpare sous yo avèk prekosyon (${gInfo.historiography}).`,
    },
  ];

  return {
    periodSummary: gInfo.periodSummary,
    importantDates: datePair,
    historicalFigures: figurePair,
    historiographyNote: gInfo.historiography,
    comprehensionQuestions,
    reviewSummary: `Rezime Leson ${chapterNumber}.${lessonNumber} : Nan leson sa a sou "${chapterTitle}" (${lessonFocus}), nou te etidye repè kronolojik ${datePair[0].date} ak ${datePair[1].date}, wòl istorik ${figurePair[0].name} ak ${figurePair[1].name}, ansanm ak vokabilè istorik ki nesesè pou nivo ${grade}.`,
    detailedExplanation: [
      `Nan pwogram ofisyèl ISTWA D AYITI pou ${grade}, chapit "${chapterTitle}" (Leson ${chapterNumber}.${lessonNumber} : ${lessonFocus}) fè pati etid apwofondi sou "${gInfo.periodSummary}". Objektif la se bay elèv la yon konpreyansyon egzak, verifye pa sous istorik yo, sou evènman, estrikti sosyal, ak desizyon politik ki te fòme nasyon ayisyèn nan.`,
      `Repè Kronolojik ak Evènman Kle : Pou konprann sijè sa a nan lòd istorik li, elèv la dwe retounen sou dat fondamantal yo — espesyalman (${datePair[0].date} : ${datePair[0].event}) ak (${datePair[1].date} : ${datePair[1].event}). Chak dat reprezante yon tournan kote aksyon aktè istorik yo te chanje rapò fòs yo sou zile a.`,
      `Aktè ak Pèsonaj Istorik : Nan sant peryòd sa a, nou jwenn figi istorik tankou ${figurePair[0].name} (${figurePair[0].role}) ansanm ak ${figurePair[1].name} (${figurePair[1].role}), san nou pa bliye wòl mas popilè yo, fanm yo, ak kominote peyizan/mawon yo ki te pote lit la sou teren an.`,
      gInfo.historiography,
    ],
    examples: [
      {
        title: `Etid Dokiman ak Kronoloji Istorik (${grade} · Ch. ${chapterNumber}.${lessonNumber})`,
        scenario: `Analize lyen koz-a-efè ki egziste ant evènman "${datePair[0].date}" (${datePair[0].event}) ak aksyon istorik ${figurePair[0].name} nan kad chapit "${chapterTitle}".`,
        stepByStepSolution: [
          `Etap 1 — Kontèks Istorik : Idantifye epòk la (${gInfo.periodSummary}) ak sitiyasyon politik, ekonomik ak sosyal ki te egziste anvan evènman an.`,
          `Etap 2 — Aktè ak Aksyon : Eksplike wòl egzak ${figurePair[0].name} (${figurePair[0].role}) ak objektif li te pouswiv.`,
          `Etap 3 — Konsekans ak Eritaj : Montre kijan evènman sa a te prepare etap ki vin apre a (${datePair[1].date}) nan istwa Ayiti.`,
        ],
        conclusion: `Analiz kronolojik la montre ke "${chapterTitle}" se yon mayon endispansab nan evolisyon istorik Ayiti.`,
      },
      {
        title: `Metòd Kritik Sous Istorik yo (Prèv ak Entèpretasyon nan ${grade})`,
        scenario: `Lè yon elèv ${grade} ap li de (2) sous diferan sou "${chapterTitle}", kijan li dwe travay pou li pa envante enfòmasyon epi respekte verite istorik la?`,
        stepByStepSolution: [
          `Etap 1 — Idantifye nati sous la (akt ofisyèl, korespondans epòk la, kronik kolonyal oswa travay istoryen ayisyen).`,
          `Etap 2 — Verifye dat, kote ak non pèsonaj yo (${figurePair[1].name}) avèk presizyon.`,
          `Etap 3 — Aplike prensip prèv la: ${gInfo.historiography}`,
        ],
        conclusion: `Règ fondamantal Istwa D Ayiti nan ASLA se baze chak afirmasyon sou dat egzak ak prèv istorik verifye.`,
      },
    ],
    vocabulary: gInfo.vocabularyPool,
  };
}
