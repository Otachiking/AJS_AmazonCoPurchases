/**
 * ============================================
 * AMAZON CO-PURCHASE NETWORK PRESENTATION
 * JavaScript Controller
 * ============================================
 * 
 * Features:
 * - Horizontal slide navigation (keyboard only: left/right arrows)
 * - Network graph visualization using Vis.js
 * - Community detection visualization
 * - Information diffusion simulation
 * - Integration ready for Google Colab data
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    totalSlides: 10,
    transitionDuration: 600,
    nodesPath: 'nodes.json',
    edgesPath: 'edges.json',
    genreGraphPath: 'graph_genre.json',
    genreCorrelationPath: 'genre_correlation.json'
};

// Genre color mapping
const GENRE_COLORS = {
    'Drama': '#EF4444',
    'Comedy': '#F59E0B',
    'Action & Adventure': '#10B981',
    'Horror': '#6366F1',
    'Kids & Family': '#EC4899',
    'Science Fiction & Fantasy': '#8B5CF6',
    'Mystery & Suspense': '#06B6D4',
    'Documentary': '#84CC16',
    'Television': '#F97316',
    'Music Video & Concerts': '#14B8A6',
    'Musicals & Performing Arts': '#A855F7',
    'Classics': '#78716C',
    'Animation': '#FB7185',
    'Sports': '#22C55E',
    'Military & War': '#64748B',
    'Art & International': '#0EA5E9',
    'Religion & Spirituality': '#D946EF',
    'General': '#71717A',
    'Adult': '#BE123C',
    'Travel': '#0D9488',
    'Other': '#94A3B8'
};

// Community colors (distinct palette)
const COMMUNITY_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
    '#F43F5E', '#78716C', '#71717A', '#64748B', '#475569'
];

// Community Summary Data (from report_community_summary.csv)
const COMMUNITY_SUMMARY_DATA = [
    { community: 56, nNode: 13, nGenre: 6, bestNodeId: 261584, bestNodeTitle: "Hollywood Screen Tests, Take 1", bestNodeDegree: 11, members: "261582,261583,261584,261587,261588,261590,261593,261594,261595,261598,261599,261605,261606" },
    { community: 73, nNode: 6, nGenre: 6, bestNodeId: 114191, bestNodeTitle: "Listen to Britain and Other Films by Humphrey Jennings", bestNodeDegree: 8, members: "114187,114189,114190,114191,143564,182209" },
    { community: 13, nNode: 6, nGenre: 5, bestNodeId: 12617, bestNodeTitle: "Burial Ground - Night of Terror", bestNodeDegree: 4, members: "12615,12617,12618,15740,81590,236161" },
    { community: 12, nNode: 6, nGenre: 3, bestNodeId: 240155, bestNodeTitle: "Cinema Europe - The Other Hollywood", bestNodeDegree: 5, members: "10080,12610,234557,234558,234559,240155" },
    { community: 57, nNode: 5, nGenre: 5, bestNodeId: 150648, bestNodeTitle: "Don't Leave Me Alone Daisy Collection", bestNodeDegree: 6, members: "94311,150648,150649,182969,182970" },
    { community: 106, nNode: 5, nGenre: 5, bestNodeId: 170823, bestNodeTitle: "The Magic Show with Doug Henning", bestNodeDegree: 6, members: "79136,170821,170822,170823,193277" },
    { community: 147, nNode: 5, nGenre: 4, bestNodeId: 247061, bestNodeTitle: "Why Do They Say Love When They Mean Sex?", bestNodeDegree: 4, members: "241596,245283,247059,247060,247061" },
    { community: 58, nNode: 5, nGenre: 3, bestNodeId: 95719, bestNodeTitle: "Not of This Earth", bestNodeDegree: 6, members: "95718,95719,95720,95721,95722" },
    { community: 66, nNode: 5, nGenre: 3, bestNodeId: 109198, bestNodeTitle: "Jack the Ripper", bestNodeDegree: 7, members: "109198,109199,109200,109202,177282" },
    { community: 81, nNode: 5, nGenre: 3, bestNodeId: 132754, bestNodeTitle: "The Blue Angel", bestNodeDegree: 7, members: "132753,132754,132755,132756,132757" },
    { community: 104, nNode: 5, nGenre: 3, bestNodeId: 167608, bestNodeTitle: "Crimes of Passion", bestNodeDegree: 8, members: "167605,167606,167607,167608,167609" },
    { community: 161, nNode: 5, nGenre: 3, bestNodeId: 261352, bestNodeTitle: "Taps", bestNodeDegree: 8, members: "261351,261352,261361,261371,261372" },
    { community: 7, nNode: 4, nGenre: 4, bestNodeId: 9279, bestNodeTitle: "Dark Shadows DVD Collection 2", bestNodeDegree: 6, members: "9275,9276,9277,9279" },
    { community: 11, nNode: 4, nGenre: 4, bestNodeId: 12512, bestNodeTitle: "Rodgers & Hammerstein's South Pacific", bestNodeDegree: 6, members: "12511,12512,12514,12515" },
    { community: 19, nNode: 4, nGenre: 4, bestNodeId: 27739, bestNodeTitle: "Trick Or Treat", bestNodeDegree: 4, members: "20178,20180,20181,27739" },
    { community: 30, nNode: 4, nGenre: 4, bestNodeId: 48094, bestNodeTitle: "The Rose", bestNodeDegree: 3, members: "48094,82797,106110,123122" },
    { community: 52, nNode: 4, nGenre: 4, bestNodeId: 86113, bestNodeTitle: "The Navigator", bestNodeDegree: 5, members: "84416,86113,86114,86115" },
    { community: 61, nNode: 4, nGenre: 4, bestNodeId: 103734, bestNodeTitle: "The Men Who Killed Kennedy", bestNodeDegree: 5, members: "103732,103733,103734,103735" },
    { community: 76, nNode: 4, nGenre: 4, bestNodeId: 117845, bestNodeTitle: "Blood Surf", bestNodeDegree: 5, members: "117841,117842,117843,117845" },
    { community: 109, nNode: 4, nGenre: 4, bestNodeId: 172383, bestNodeTitle: "The Twilight Zone - Vol. 24", bestNodeDegree: 6, members: "172383,174124,174126,174127" },
    { community: 151, nNode: 4, nGenre: 4, bestNodeId: 247126, bestNodeTitle: "WWE Hardcore", bestNodeDegree: 6, members: "247057,247058,247125,247126" },
    { community: 154, nNode: 4, nGenre: 4, bestNodeId: 252232, bestNodeTitle: "Snare Drum Basics-DVD", bestNodeDegree: 6, members: "252232,252233,252235,254647" },
    { community: 2, nNode: 4, nGenre: 3, bestNodeId: 1677, bestNodeTitle: "Robert Louis Stevenson's St. Ives", bestNodeDegree: 5, members: "1677,1678,1679,4026" },
    { community: 9, nNode: 4, nGenre: 3, bestNodeId: 11430, bestNodeTitle: "Wishmaster 4: The Prophecy Fulfilled", bestNodeDegree: 6, members: "11427,11428,11429,11430" },
    { community: 25, nNode: 4, nGenre: 3, bestNodeId: 34281, bestNodeTitle: "The Adam Sandler Collection (Billy Madison, Bulletproof, & Happy Gilmore)", bestNodeDegree: 5, members: "34279,34281,58754,58755" },
    { community: 26, nNode: 4, nGenre: 3, bestNodeId: 34843, bestNodeTitle: "El Tri - Sinfonico", bestNodeDegree: 6, members: "34841,34842,34843,34845" },
    { community: 35, nNode: 4, nGenre: 3, bestNodeId: 58967, bestNodeTitle: "The Lost Command", bestNodeDegree: 5, members: "58967,58968,58969,58970" },
    { community: 70, nNode: 4, nGenre: 3, bestNodeId: 134129, bestNodeTitle: "The Golem", bestNodeDegree: 5, members: "112864,134126,134127,134129" },
    { community: 74, nNode: 4, nGenre: 3, bestNodeId: 114377, bestNodeTitle: "Super Atragon: The Motion Picture", bestNodeDegree: 6, members: "114376,114377,114378,114379" },
    { community: 77, nNode: 4, nGenre: 3, bestNodeId: 151158, bestNodeTitle: "Chaplin's Essanay Comedies, Vol. 02", bestNodeDegree: 5, members: "118133,151157,151158,195792" },
    { community: 85, nNode: 4, nGenre: 3, bestNodeId: 134449, bestNodeTitle: "Jeeves & Wooster - The Complete First Season", bestNodeDegree: 6, members: "134446,134447,134448,134449" },
    { community: 127, nNode: 4, nGenre: 3, bestNodeId: 215422, bestNodeTitle: "Seven Blood-Stained Orchids", bestNodeDegree: 3, members: "215420,215422,215423,228095" },
    { community: 130, nNode: 4, nGenre: 3, bestNodeId: 42132, bestNodeTitle: "Breaking the Waves", bestNodeDegree: 3, members: "42132,215493,221019,223911" },
    { community: 144, nNode: 4, nGenre: 3, bestNodeId: 239547, bestNodeTitle: "Call Me Claus", bestNodeDegree: 5, members: "239545,239546,239547,242693" },
    { community: 146, nNode: 4, nGenre: 3, bestNodeId: 240425, bestNodeTitle: "Tom and Jerry - Whiskers Away", bestNodeDegree: 6, members: "240422,240423,240424,240425" },
    { community: 157, nNode: 4, nGenre: 3, bestNodeId: 256873, bestNodeTitle: "Tempest 3000", bestNodeDegree: 6, members: "256871,256873,258064,258065" },
    { community: 45, nNode: 4, nGenre: 2, bestNodeId: 82590, bestNodeTitle: "Now and Then, Here and There - Conflict & Chaos (Vol. 3)", bestNodeDegree: 6, members: "82587,82588,82589,82590" },
    { community: 47, nNode: 4, nGenre: 2, bestNodeId: 82791, bestNodeTitle: "The Kid With the Golden Arm", bestNodeDegree: 6, members: "82789,82790,82791,82792" },
    { community: 69, nNode: 4, nGenre: 2, bestNodeId: 109817, bestNodeTitle: "Black Mama, White Mama", bestNodeDegree: 6, members: "109815,109816,109817,109819" },
    { community: 91, nNode: 4, nGenre: 2, bestNodeId: 151438, bestNodeTitle: "Through the Years of Hip Hop, Vol. 1 - Graffiti", bestNodeDegree: 6, members: "151436,151437,151438,151439" },
    { community: 113, nNode: 4, nGenre: 2, bestNodeId: 183260, bestNodeTitle: "Charlotte Church - Prelude: The Best of Charlotte Church", bestNodeDegree: 6, members: "183256,183258,183259,183260" },
    { community: 125, nNode: 4, nGenre: 2, bestNodeId: 213140, bestNodeTitle: "The Winner Takes It All - The ABBA Story", bestNodeDegree: 5, members: "213140,213141,213142,213143" },
    { community: 137, nNode: 4, nGenre: 2, bestNodeId: 226743, bestNodeTitle: "Lust for a Vampire", bestNodeDegree: 5, members: "226742,226743,226744,226745" },
    { community: 152, nNode: 4, nGenre: 2, bestNodeId: 250585, bestNodeTitle: "Where the Truth Lies", bestNodeDegree: 6, members: "247207,247208,247210,250585" },
    { community: 8, nNode: 3, nGenre: 3, bestNodeId: 18825, bestNodeTitle: "Cinderella (Wide World of Disney)", bestNodeDegree: 4, members: "10443,18824,18825" },
    { community: 20, nNode: 3, nGenre: 3, bestNodeId: 21353, bestNodeTitle: "The Unbelievable Truth", bestNodeDegree: 4, members: "21351,21352,21353" },
    { community: 31, nNode: 3, nGenre: 3, bestNodeId: 50475, bestNodeTitle: "Fail-safe (Special Edition)", bestNodeDegree: 4, members: "50475,50476,58974" },
    { community: 38, nNode: 3, nGenre: 3, bestNodeId: 91015, bestNodeTitle: "Journey Into Amazing Caves (Large Format)", bestNodeDegree: 4, members: "63633,91014,91015" },
    { community: 39, nNode: 3, nGenre: 3, bestNodeId: 83104, bestNodeTitle: "Proof of Life", bestNodeDegree: 4, members: "67138,83102,83104" },
    { community: 49, nNode: 3, nGenre: 3, bestNodeId: 83642, bestNodeTitle: "Hollywood at Your Feet - The Story of the Chinese Theatre Footprints", bestNodeDegree: 4, members: "83639,83640,83642" },
    { community: 50, nNode: 3, nGenre: 3, bestNodeId: 83872, bestNodeTitle: "Metrosexuality", bestNodeDegree: 4, members: "83870,83871,83872" },
    { community: 51, nNode: 3, nGenre: 3, bestNodeId: 84395, bestNodeTitle: "Grateful Dead - View from the Vault III", bestNodeDegree: 4, members: "84393,84394,84395" },
    { community: 54, nNode: 3, nGenre: 3, bestNodeId: 89494, bestNodeTitle: "Yu Yu Hakusho - Dark Tournament (Uncut)", bestNodeDegree: 4, members: "89493,89494,89495" },
    { community: 65, nNode: 3, nGenre: 3, bestNodeId: 108099, bestNodeTitle: "Death of a Prophet", bestNodeDegree: 4, members: "108097,108098,108099" },
    { community: 72, nNode: 3, nGenre: 3, bestNodeId: 114153, bestNodeTitle: "Heaven", bestNodeDegree: 3, members: "114153,114155,114156" },
    { community: 75, nNode: 3, nGenre: 3, bestNodeId: 116476, bestNodeTitle: "Sinderella and the Golden Bra / Goldilocks and the Three Bares (Something Weird)", bestNodeDegree: 4, members: "116473,116475,116476" },
    { community: 86, nNode: 3, nGenre: 3, bestNodeId: 135689, bestNodeTitle: "Deepak Chopra-The Essential DVD Collection", bestNodeDegree: 4, members: "135687,135688,135689" },
    { community: 88, nNode: 3, nGenre: 3, bestNodeId: 150642, bestNodeTitle: "No Code of Conduct", bestNodeDegree: 4, members: "141183,150641,150642" },
    { community: 90, nNode: 3, nGenre: 3, bestNodeId: 163838, bestNodeTitle: "Iron Maiden - Rock in Rio", bestNodeDegree: 4, members: "146661,163838,163839" },
    { community: 93, nNode: 3, nGenre: 3, bestNodeId: 151877, bestNodeTitle: "Ossessione", bestNodeDegree: 4, members: "151875,151876,151877" },
    { community: 94, nNode: 3, nGenre: 3, bestNodeId: 156752, bestNodeTitle: "The Girl with the Hungry Eyes", bestNodeDegree: 4, members: "152128,156752,159777" },
    { community: 98, nNode: 3, nGenre: 3, bestNodeId: 182994, bestNodeTitle: "The Legend of Lobo", bestNodeDegree: 3, members: "121377,160025,182994" },
    { community: 102, nNode: 3, nGenre: 3, bestNodeId: 171944, bestNodeTitle: "Elie Wiesel Goes Home", bestNodeDegree: 3, members: "82777,166709,171944" },
    { community: 107, nNode: 3, nGenre: 3, bestNodeId: 196673, bestNodeTitle: "Walkabout - Criterion Collection", bestNodeDegree: 4, members: "171339,179925,196673" },
    { community: 108, nNode: 3, nGenre: 3, bestNodeId: 171956, bestNodeTitle: "Quiet Days in Clichy", bestNodeDegree: 4, members: "171954,171956,195268" },
    { community: 110, nNode: 3, nGenre: 3, bestNodeId: 174121, bestNodeTitle: "The Big Heat", bestNodeDegree: 4, members: "174119,174120,174121" },
    { community: 114, nNode: 3, nGenre: 3, bestNodeId: 185257, bestNodeTitle: "The Lucio Fulci Collection Volume 1 (The House By the Cemetery/The Beyond)", bestNodeDegree: 4, members: "185257,185258,185259" },
    { community: 116, nNode: 3, nGenre: 3, bestNodeId: 186892, bestNodeTitle: "Emmanuelle in Space - Collection", bestNodeDegree: 4, members: "186890,186891,186892" },
    { community: 117, nNode: 3, nGenre: 3, bestNodeId: 191032, bestNodeTitle: "Darkside Blues", bestNodeDegree: 4, members: "191031,191032,224456" },
    { community: 122, nNode: 3, nGenre: 3, bestNodeId: 230202, bestNodeTitle: "The Shadow Riders", bestNodeDegree: 4, members: "208603,230201,230202" },
    { community: 124, nNode: 3, nGenre: 3, bestNodeId: 226058, bestNodeTitle: "Homework", bestNodeDegree: 4, members: "212835,226058,234070" },
    { community: 131, nNode: 3, nGenre: 3, bestNodeId: 218640, bestNodeTitle: "Fatboy Slim: Live on Brighton Beach - Big Beach Boutique, Vol. 2", bestNodeDegree: 4, members: "215780,218639,218640" },
    { community: 132, nNode: 3, nGenre: 3, bestNodeId: 216254, bestNodeTitle: "Pippin", bestNodeDegree: 4, members: "216252,216253,216254" },
    { community: 134, nNode: 3, nGenre: 3, bestNodeId: 224714, bestNodeTitle: "Go, Go Second Time Virgin", bestNodeDegree: 4, members: "224714,224716,224718" },
    { community: 136, nNode: 3, nGenre: 3, bestNodeId: 226736, bestNodeTitle: "Anzio", bestNodeDegree: 4, members: "226734,226735,226736" },
    { community: 139, nNode: 3, nGenre: 3, bestNodeId: 240539, bestNodeTitle: "Backstage Pass - DVD Concert Collection Vol. 01", bestNodeDegree: 4, members: "233209,240539,242267" },
    { community: 145, nNode: 3, nGenre: 3, bestNodeId: 240077, bestNodeTitle: "Dr. Quinn Medicine Woman - The Complete Season One", bestNodeDegree: 4, members: "240075,240076,240077" },
    { community: 148, nNode: 3, nGenre: 3, bestNodeId: 245999, bestNodeTitle: "TV Guide Looks at Science Fiction", bestNodeDegree: 4, members: "242324,245998,245999" },
    { community: 153, nNode: 3, nGenre: 3, bestNodeId: 252228, bestNodeTitle: "Tighter Assets with Tamilee: Weight Loss", bestNodeDegree: 3, members: "146479,252209,252228" },
    { community: 158, nNode: 3, nGenre: 3, bestNodeId: 260145, bestNodeTitle: "The Mean Season", bestNodeDegree: 4, members: "260143,260144,260145" },
    { community: 128, nNode: 3, nGenre: 3, bestNodeId: 261604, bestNodeTitle: "Where Have You Gone, Joe DiMaggio?", bestNodeDegree: 4, members: "261600,261603,261604" },
    { community: 3, nNode: 3, nGenre: 2, bestNodeId: 4740, bestNodeTitle: "Fluke/Napoleon", bestNodeDegree: 4, members: "4740,4741,9804" },
    { community: 5, nNode: 3, nGenre: 2, bestNodeId: 8334, bestNodeTitle: "The Wiggles - Hoop-Dee-Doo! It's a Wiggly Party", bestNodeDegree: 4, members: "8333,8334,8336" },
    { community: 15, nNode: 3, nGenre: 2, bestNodeId: 22154, bestNodeTitle: "Jungle Book", bestNodeDegree: 4, members: "18234,22153,22154" },
    { community: 16, nNode: 3, nGenre: 2, bestNodeId: 18905, bestNodeTitle: "I'm All Right Jack", bestNodeDegree: 3, members: "18237,18903,18905" },
    { community: 18, nNode: 3, nGenre: 2, bestNodeId: 33416, bestNodeTitle: "In a Class of His Own", bestNodeDegree: 3, members: "5357,20172,33416" },
    { community: 33, nNode: 3, nGenre: 2, bestNodeId: 56839, bestNodeTitle: "Heart of Dixie", bestNodeDegree: 4, members: "56837,56838,56839" },
    { community: 37, nNode: 3, nGenre: 2, bestNodeId: 64722, bestNodeTitle: "Dragon Ball Z:Perfect Cell-Perfection", bestNodeDegree: 3, members: "60126,64722,64723" },
    { community: 46, nNode: 3, nGenre: 2, bestNodeId: 82596, bestNodeTitle: "Maetel Legend/Harlock Saga", bestNodeDegree: 4, members: "82596,82597,82599" },
    { community: 55, nNode: 3, nGenre: 2, bestNodeId: 91026, bestNodeTitle: "National Parks of Alaska", bestNodeDegree: 4, members: "91024,91025,91026" },
    { community: 60, nNode: 3, nGenre: 2, bestNodeId: 100428, bestNodeTitle: "WWE Summerslam 2001", bestNodeDegree: 4, members: "100426,100427,100428" },
    { community: 67, nNode: 3, nGenre: 2, bestNodeId: 109209, bestNodeTitle: "The Mystery of Picasso", bestNodeDegree: 4, members: "109209,109210,109211" },
    { community: 79, nNode: 3, nGenre: 2, bestNodeId: 130953, bestNodeTitle: "Buying the Cow/Love Stinks", bestNodeDegree: 4, members: "123271,130952,130953" },
    { community: 80, nNode: 3, nGenre: 2, bestNodeId: 132752, bestNodeTitle: "Gung Ho!", bestNodeDegree: 4, members: "132749,132750,132752" },
    { community: 84, nNode: 3, nGenre: 2, bestNodeId: 134396, bestNodeTitle: "American Buffalo", bestNodeDegree: 4, members: "134395,134396,134397" },
    { community: 97, nNode: 3, nGenre: 2, bestNodeId: 158150, bestNodeTitle: "Playboy TV - Night Calls 411", bestNodeDegree: 4, members: "158147,158149,158150" },
    { community: 101, nNode: 3, nGenre: 2, bestNodeId: 164932, bestNodeTitle: "Gappa, the Triphibian Monster", bestNodeDegree: 4, members: "164928,164930,164932" },
    { community: 111, nNode: 3, nGenre: 2, bestNodeId: 187215, bestNodeTitle: "Kids From Shaolin/Deadend of B", bestNodeDegree: 4, members: "177369,187214,187215" },
    { community: 120, nNode: 3, nGenre: 2, bestNodeId: 199100, bestNodeTitle: "American Gigolo", bestNodeDegree: 4, members: "199097,199099,199100" },
    { community: 121, nNode: 3, nGenre: 2, bestNodeId: 208397, bestNodeTitle: "The Star Wagon (Broadway Theatre Archive)", bestNodeDegree: 4, members: "208393,208395,208397" },
    { community: 133, nNode: 3, nGenre: 2, bestNodeId: 217588, bestNodeTitle: "Thomas the Tank Engine - Best of Thomas", bestNodeDegree: 4, members: "217585,217587,217588" },
    { community: 135, nNode: 3, nGenre: 2, bestNodeId: 224943, bestNodeTitle: "Keeping Up Appearances:Hints from Hyacinth", bestNodeDegree: 4, members: "224942,224943,231169" },
    { community: 140, nNode: 3, nGenre: 2, bestNodeId: 235337, bestNodeTitle: "Lone Ranger", bestNodeDegree: 4, members: "235334,235335,235337" },
    { community: 142, nNode: 3, nGenre: 2, bestNodeId: 238142, bestNodeTitle: "Dunston Checks In", bestNodeDegree: 4, members: "238140,238141,238142" },
    { community: 143, nNode: 3, nGenre: 2, bestNodeId: 239443, bestNodeTitle: "Best Picture Collection - Musicals (An American in Paris/Gigi/My Fair Lady)", bestNodeDegree: 3, members: "178871,238580,239443" },
    { community: 149, nNode: 3, nGenre: 2, bestNodeId: 243595, bestNodeTitle: "Alice in Wonderland", bestNodeDegree: 4, members: "243592,243593,243595" },
    { community: 155, nNode: 3, nGenre: 2, bestNodeId: 253129, bestNodeTitle: "Agatha Christie's Why Didn't They Ask Evans?", bestNodeDegree: 4, members: "252239,252240,253129" },
    { community: 63, nNode: 3, nGenre: 2, bestNodeId: 261873, bestNodeTitle: "Upstairs Downstairs - The Complete Fifth Season", bestNodeDegree: 4, members: "261871,261872,261873" },
    { community: 14, nNode: 3, nGenre: 1, bestNodeId: 12648, bestNodeTitle: "Transformers Volume 1 Season 1", bestNodeDegree: 4, members: "12646,12647,12648" },
    { community: 44, nNode: 3, nGenre: 1, bestNodeId: 80644, bestNodeTitle: "Mommy & Me - Fun & Friends", bestNodeDegree: 4, members: "80642,80643,80644" },
    { community: 78, nNode: 3, nGenre: 1, bestNodeId: 120424, bestNodeTitle: "WWE Vengeance 2001 - One Undisputed Champion", bestNodeDegree: 4, members: "120424,120425,120426" },
    { community: 83, nNode: 3, nGenre: 1, bestNodeId: 134385, bestNodeTitle: "Dream a Dream: Charlotte Church in the Holy Land", bestNodeDegree: 4, members: "134383,134384,134385" },
    { community: 0, nNode: 2, nGenre: 2, bestNodeId: 1640, bestNodeTitle: "I Love Lucy - Season One (Vol. 3)", bestNodeDegree: 2, members: "1627,1640" },
    { community: 1, nNode: 2, nGenre: 2, bestNodeId: 1632, bestNodeTitle: "Dragon Ball Z - Babidi - Battle Royal", bestNodeDegree: 2, members: "1631,1632" },
    { community: 4, nNode: 2, nGenre: 2, bestNodeId: 8201, bestNodeTitle: "Eminem - All Access Europe", bestNodeDegree: 2, members: "8200,8201" },
    { community: 6, nNode: 2, nGenre: 2, bestNodeId: 9256, bestNodeTitle: "Kelly Clarkson - Before Your Love/A Moment Like This (DVD Single)", bestNodeDegree: 2, members: "9253,9256" },
    { community: 10, nNode: 2, nGenre: 2, bestNodeId: 176, bestNodeTitle: "Avengers '67 - Set 1, Vols. 1 & 2", bestNodeDegree: 1, members: "176,12064" },
    { community: 17, nNode: 2, nGenre: 2, bestNodeId: 28776, bestNodeTitle: "Last House on Dead End Street", bestNodeDegree: 2, members: "18966,28776" },
    { community: 23, nNode: 2, nGenre: 2, bestNodeId: 28010, bestNodeTitle: "Fascination", bestNodeDegree: 2, members: "24804,28010" },
    { community: 24, nNode: 2, nGenre: 2, bestNodeId: 33211, bestNodeTitle: "Drift", bestNodeDegree: 2, members: "33209,33211" },
    { community: 28, nNode: 2, nGenre: 2, bestNodeId: 67530, bestNodeTitle: "Terry Pratchett's Discworld - Soul Music", bestNodeDegree: 2, members: "44837,67530" },
    { community: 29, nNode: 2, nGenre: 2, bestNodeId: 79765, bestNodeTitle: "10 Violent Women", bestNodeDegree: 2, members: "47753,79765" },
    { community: 32, nNode: 2, nGenre: 2, bestNodeId: 6459, bestNodeTitle: "Barney's Rhyme Time Rhythm", bestNodeDegree: 1, members: "6459,52053" },
    { community: 34, nNode: 2, nGenre: 2, bestNodeId: 59891, bestNodeTitle: "Clue", bestNodeDegree: 2, members: "57656,59891" },
    { community: 36, nNode: 2, nGenre: 2, bestNodeId: 59459, bestNodeTitle: "One Flew Over the Cuckoo's Nest (Two-Disc Special Edition)", bestNodeDegree: 2, members: "59459,122645" },
    { community: 40, nNode: 2, nGenre: 2, bestNodeId: 67534, bestNodeTitle: "Return to Waterloo/Come Dancing", bestNodeDegree: 2, members: "67533,67534" },
    { community: 41, nNode: 2, nGenre: 2, bestNodeId: 69498, bestNodeTitle: "Gladiator Challenge: Showdown At Soboda", bestNodeDegree: 1, members: "57140,69498" },
    { community: 42, nNode: 2, nGenre: 2, bestNodeId: 76200, bestNodeTitle: "Shriek of the Mutilated", bestNodeDegree: 2, members: "76200,105975" },
    { community: 43, nNode: 2, nGenre: 2, bestNodeId: 79573, bestNodeTitle: "The Thin Red Line - DTS", bestNodeDegree: 2, members: "79572,79573" },
    { community: 53, nNode: 2, nGenre: 2, bestNodeId: 87455, bestNodeTitle: "The Tormented/Lady Frankenstein", bestNodeDegree: 2, members: "87453,87455" },
    { community: 59, nNode: 2, nGenre: 2, bestNodeId: 99681, bestNodeTitle: "Firm Parts Upper Body/Standing Legs", bestNodeDegree: 2, members: "99681,107655" },
    { community: 62, nNode: 2, nGenre: 2, bestNodeId: 145232, bestNodeTitle: "No Dessert Dad 'Til You Mow The Lawn", bestNodeDegree: 2, members: "106095,145232" },
    { community: 64, nNode: 2, nGenre: 2, bestNodeId: 106670, bestNodeTitle: "Playboy - Red Hot Redheads", bestNodeDegree: 2, members: "106666,106670" },
    { community: 68, nNode: 2, nGenre: 2, bestNodeId: 109214, bestNodeTitle: "Xena - Series Finale", bestNodeDegree: 2, members: "109213,109214" },
    { community: 71, nNode: 2, nGenre: 2, bestNodeId: 142854, bestNodeTitle: "Throw Momma from the Train", bestNodeDegree: 2, members: "113710,142854" },
    { community: 82, nNode: 2, nGenre: 2, bestNodeId: 133801, bestNodeTitle: "Dead Reckoning", bestNodeDegree: 2, members: "133800,133801" },
    { community: 87, nNode: 2, nGenre: 2, bestNodeId: 90049, bestNodeTitle: "Charlotte's Web 2 - Wilbur's Great Adventure", bestNodeDegree: 1, members: "90049,139066" },
    { community: 89, nNode: 2, nGenre: 2, bestNodeId: 144901, bestNodeTitle: "Dragon Ball Z - Imperfect Cell - Discovery", bestNodeDegree: 1, members: "144899,144901" },
    { community: 92, nNode: 2, nGenre: 2, bestNodeId: 151461, bestNodeTitle: "Go for Broke!", bestNodeDegree: 2, members: "151460,151461" },
    { community: 95, nNode: 2, nGenre: 2, bestNodeId: 154070, bestNodeTitle: "Tower of Song - An Epic Story of Canada and Its Music", bestNodeDegree: 2, members: "154069,154070" },
    { community: 96, nNode: 2, nGenre: 2, bestNodeId: 180401, bestNodeTitle: "Trail of a Serial Killer", bestNodeDegree: 2, members: "155316,180401" },
    { community: 99, nNode: 2, nGenre: 2, bestNodeId: 192777, bestNodeTitle: "The Method Pilates - Precision Toning and Sculpting", bestNodeDegree: 2, members: "161919,192777" },
    { community: 100, nNode: 2, nGenre: 2, bestNodeId: 164059, bestNodeTitle: "American Pie (Widescreen Unrated Ultimate Edition)", bestNodeDegree: 2, members: "164058,164059" },
    { community: 103, nNode: 2, nGenre: 2, bestNodeId: 167539, bestNodeTitle: "Four of the Apocalypse", bestNodeDegree: 2, members: "167538,167539" },
    { community: 105, nNode: 2, nGenre: 2, bestNodeId: 170215, bestNodeTitle: "The Hills Have Eyes, Part 2", bestNodeDegree: 2, members: "170213,170215" },
    { community: 112, nNode: 2, nGenre: 2, bestNodeId: 177377, bestNodeTitle: "Startup.com", bestNodeDegree: 2, members: "177376,177377" },
    { community: 118, nNode: 2, nGenre: 2, bestNodeId: 196682, bestNodeTitle: "Medabots - The Face of Dr. Meta-Evil (Vol. 6)", bestNodeDegree: 2, members: "196681,196682" },
    { community: 123, nNode: 2, nGenre: 2, bestNodeId: 210922, bestNodeTitle: "Beach Blanket Bingo", bestNodeDegree: 2, members: "210921,210922" },
    { community: 126, nNode: 2, nGenre: 2, bestNodeId: 225861, bestNodeTitle: "Convict 762", bestNodeDegree: 2, members: "213947,225861" },
    { community: 129, nNode: 2, nGenre: 2, bestNodeId: 218402, bestNodeTitle: "Die Hard - The Ultimate Collection", bestNodeDegree: 2, members: "215427,218402" },
    { community: 141, nNode: 2, nGenre: 2, bestNodeId: 86193, bestNodeTitle: "Day of the Triffids", bestNodeDegree: 1, members: "86193,238099" },
    { community: 156, nNode: 2, nGenre: 2, bestNodeId: 253143, bestNodeTitle: "Eastwood After Hours (Live at Carnegie Hall)", bestNodeDegree: 2, members: "253141,253143" },
    { community: 159, nNode: 2, nGenre: 2, bestNodeId: 260972, bestNodeTitle: "Bloody Vampire", bestNodeDegree: 2, members: "260910,260972" },
    { community: 160, nNode: 2, nGenre: 2, bestNodeId: 260967, bestNodeTitle: "Samson in the Wax Museum", bestNodeDegree: 2, members: "260966,260967" },
    { community: 150, nNode: 2, nGenre: 2, bestNodeId: 261653, bestNodeTitle: "Surviving Desire", bestNodeDegree: 2, members: "261649,261653" },
    { community: 21, nNode: 2, nGenre: 1, bestNodeId: 22276, bestNodeTitle: "Family Plot", bestNodeDegree: 2, members: "22274,22276" },
    { community: 22, nNode: 2, nGenre: 1, bestNodeId: 26026, bestNodeTitle: "The End of the Affair", bestNodeDegree: 2, members: "24457,26026" },
    { community: 27, nNode: 2, nGenre: 1, bestNodeId: 38978, bestNodeTitle: "The Honeymooners - The Lost Episodes, Vol. 6", bestNodeDegree: 2, members: "38977,38978" },
    { community: 48, nNode: 2, nGenre: 1, bestNodeId: 94252, bestNodeTitle: "Love on a Diet", bestNodeDegree: 2, members: "83105,94252" },
    { community: 115, nNode: 2, nGenre: 1, bestNodeId: 186851, bestNodeTitle: "Sesame Street - Kids' Favorite Songs", bestNodeDegree: 2, members: "186850,186851" },
    { community: 119, nNode: 2, nGenre: 1, bestNodeId: 199074, bestNodeTitle: "Atlantis - The Lost Empire (Disney Collector's Edition)", bestNodeDegree: 2, members: "199072,199074" },
    { community: 138, nNode: 2, nGenre: 1, bestNodeId: 227438, bestNodeTitle: "Grand Slam", bestNodeDegree: 2, members: "227437,227438" }
];

// ============================================
// STATE
// ============================================

let state = {
    currentSlide: 0,
    networkInstance: null,
    communityNetworkInstance: null,
    diffusionNetworkInstance: null,
    genreNetworkInstance: null,
    
    // Data
    nodesData: null,
    edgesData: null,
    nodeMap: {},
    
    // Vis.js DataSets
    nodesDataSet: null,
    edgesDataSet: null,
    allNodes: [],
    allEdges: [],
    
    // Filtering state
    excludedGenres: new Set(),
    isolatedGenre: null,
    physicsEnabled: true,
    
    // Diffusion state
    selectedSeeds: [],
    diffusionRunning: false,
    activatedNodes: new Set(),
    diffusionStep: 0
};

// ============================================
// SLIDE NAVIGATION
// ============================================

function goToSlide(index) {
    if (index < 0 || index >= CONFIG.totalSlides) return;
    
    state.currentSlide = index;
    
    const wrapper = document.querySelector('.slides-wrapper');
    wrapper.style.transform = `translateX(-${index * 100}vw)`;
    
    document.querySelectorAll('.nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Initialize graphs based on slide
    if (index === 4 && !state.networkInstance) {
        initNetworkGraph();
    }
    if (index === 5 && !state.communityNetworkInstance) {
        initCommunityGraph();
    }
    if (index === 6 && state.nodesData) {
        populateInfluentialTable();
    }
    if (index === 7 && !state.genreNetworkInstance) {
        initGenreGraph('default');
        // Setup controls only once
        setupGenreGraphControlsOnce();
    }
    if (index === 8 && !state.diffusionNetworkInstance) {
        initDiffusionGraph();
    }
}

function nextSlide() {
    goToSlide(state.currentSlide + 1);
}

function prevSlide() {
    goToSlide(state.currentSlide - 1);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(CONFIG.totalSlides - 1);
                break;
            case 'Escape':
                closeModal();
                break;
        }
    });
}

// ============================================
// CLICK NAVIGATION
// ============================================

function initClickNavigation() {
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('click', () => {
            const slideIndex = parseInt(item.dataset.slide);
            goToSlide(slideIndex);
        });
    });
}

// ============================================
// GRAPH DATA LOADING
// ============================================

function loadGraphData() {
    // Use embedded data from data.js (NODES_DATA and EDGES_DATA)
    if (typeof NODES_DATA === 'undefined' || typeof EDGES_DATA === 'undefined') {
        console.error('Embedded data not found. Make sure data.js is loaded.');
        return null;
    }
    
    state.nodesData = NODES_DATA;
    state.edgesData = EDGES_DATA;
    
    // Build node map for quick lookup
    state.nodesData.nodes.forEach(n => {
        state.nodeMap[n.id] = n;
    });
    
    return { nodes: state.nodesData.nodes, edges: state.edgesData.edges };
}

// ============================================
// NETWORK GRAPH (Slide 5 - embedded data)
// ============================================

function initNetworkGraph() {
    const container = document.getElementById('network-graph');
    if (!container) return;
    
    const data = loadGraphData();
    if (!data) return;
    
    // Calculate container dimensions for positioning
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create vis nodes with widely scattered initial positions
    const visNodes = data.nodes.map((node, index) => {
        const genre = node.genre || 'Other';
        const inDeg = node.metrics?.in_degree || 0;
        const outDeg = node.metrics?.out_degree || 0;
        const totalDeg = node.metrics?.total_degree || 0;
        
        // Generate scattered positions using golden angle for even distribution
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const angle = index * goldenAngle;
        const radius = Math.sqrt(index / data.nodes.length) * Math.min(width, height) * 0.45;
        
        return {
            id: node.id,
            label: '',
            title: node.title,
            color: GENRE_COLORS[genre] || GENRE_COLORS['Other'],
            genre: genre,
            size: 5 + (totalDeg * 2),
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            nodeData: node
        };
    });
    
    // Create vis edges
    const visEdges = data.edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#CBD5E1', opacity: 0.6 }
    }));
    
    // Store for filtering
    state.allNodes = visNodes;
    state.allEdges = visEdges;
    
    state.nodesDataSet = new vis.DataSet(visNodes);
    state.edgesDataSet = new vis.DataSet(visEdges);
    
    const options = {
        autoResize: false,
        height: '100%',
        width: '100%',
        nodes: {
            shape: 'dot',
            font: { face: 'Plus Jakarta Sans', size: 10, color: '#333' },
            borderWidth: 1,
            borderWidthSelected: 3
        },
        edges: {
            width: 0.5,
            smooth: { type: 'continuous' }
        },
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 200, updateInterval: 25 },
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.3,
                springLength: 120,
                springConstant: 0.02,
                damping: 0.15
            }
        },
        interaction: { hover: true, tooltipDelay: 100, zoomView: true, dragView: true }
    };
    
    state.networkInstance = new vis.Network(
        container,
        { nodes: state.nodesDataSet, edges: state.edgesDataSet },
        options
    );
    
    // Node click handler for detail panel
    state.networkInstance.on('click', (params) => {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            showNodeDetail(nodeId);
        }
    });
    
    populateLegend(data.nodes);
    populateGenreStats(data.nodes);
    setupNetworkControls();
    setupNodeSearch();
    updateVisibleCount();
}

// Genre Statistics Pie Chart and List
function populateGenreStats(nodes) {
    const canvas = document.getElementById('genre-pie-chart');
    const listContainer = document.getElementById('genre-list');
    const totalGenresEl = document.getElementById('total-genres');
    
    if (!canvas || !listContainer) return;
    
    // Count genres
    const genreCounts = {};
    nodes.forEach(n => {
        const g = n.genre || 'Other';
        genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    
    // Sort by count
    const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1]);
    
    const totalGenres = sortedGenres.length;
    const totalNodes = nodes.length;
    
    if (totalGenresEl) {
        totalGenresEl.textContent = totalGenres;
    }
    
    // Split into top 10 and others
    const top10 = sortedGenres.slice(0, 10);
    const others = sortedGenres.slice(10);
    const othersCount = others.reduce((sum, [, count]) => sum + count, 0);
    
    // Prepare data for pie chart
    const chartData = [...top10];
    if (others.length > 0) {
        chartData.push(['Others', othersCount]);
    }
    
    // Draw pie chart
    drawPieChart(canvas, chartData, totalNodes);
    
    // Build list HTML
    let listHTML = top10.map(([genre, count]) => {
        const percent = ((count / totalNodes) * 100).toFixed(1);
        const color = GENRE_COLORS[genre] || GENRE_COLORS['Other'];
        return `
            <div class="genre-list-item">
                <span class="genre-color-dot" style="background: ${color}"></span>
                <span class="genre-name">${genre}</span>
                <span class="genre-count">${count}</span>
                <span class="genre-percent">${percent}%</span>
            </div>
        `;
    }).join('');
    
    if (others.length > 0) {
        const othersPercent = ((othersCount / totalNodes) * 100).toFixed(1);
        listHTML += `
            <div class="genre-list-item others-item" onclick="toggleOthersExpanded()">
                <span class="genre-color-dot" style="background: #999"></span>
                <span class="genre-name">Others (${others.length} genres) ▼</span>
                <span class="genre-count">${othersCount}</span>
                <span class="genre-percent">${othersPercent}%</span>
            </div>
            <div class="others-expanded" id="others-expanded" style="display: none;">
                ${others.map(([genre, count]) => {
                    const percent = ((count / totalNodes) * 100).toFixed(1);
                    const color = GENRE_COLORS[genre] || GENRE_COLORS['Other'];
                    return `
                        <div class="genre-list-item">
                            <span class="genre-color-dot" style="background: ${color}"></span>
                            <span class="genre-name">${genre}</span>
                            <span class="genre-count">${count}</span>
                            <span class="genre-percent">${percent}%</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    listContainer.innerHTML = listHTML;
}

function drawPieChart(canvas, data, total) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let startAngle = -Math.PI / 2;
    
    data.forEach(([genre, count]) => {
        const sliceAngle = (count / total) * 2 * Math.PI;
        const color = genre === 'Others' ? '#999' : (GENRE_COLORS[genre] || GENRE_COLORS['Other']);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add subtle border between slices
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        startAngle += sliceAngle;
    });
    
    // Draw center circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Draw total in center
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, centerX, centerY - 6);
    ctx.font = '10px Plus Jakarta Sans';
    ctx.fillStyle = '#666';
    ctx.fillText('nodes', centerX, centerY + 10);
}

function toggleOthersExpanded() {
    const el = document.getElementById('others-expanded');
    if (el) {
        const isHidden = el.style.display === 'none';
        el.style.display = isHidden ? 'block' : 'none';
        
        // Update arrow indicator
        const othersItem = document.querySelector('.others-item .genre-name');
        if (othersItem) {
            const text = othersItem.textContent;
            othersItem.textContent = text.replace(isHidden ? '▼' : '▲', isHidden ? '▲' : '▼');
        }
    }
}

window.toggleOthersExpanded = toggleOthersExpanded;

function showNodeDetail(nodeId) {
    const node = state.nodeMap[nodeId];
    if (!node) return;
    
    const detailContent = document.getElementById('node-detail-content');
    if (!detailContent) return;
    
    const metrics = node.metrics || {};
    
    detailContent.innerHTML = `
        <div class="detail-title">${node.title}</div>
        <div class="detail-meta">
            <span class="detail-id">ID: ${node.id}</span>
            <span class="detail-genre" style="background: ${GENRE_COLORS[node.genre] || GENRE_COLORS['Other']}">${node.genre}</span>
        </div>
        <div class="detail-section">
            <div class="detail-row">
                <span>Community</span>
                <span>${node.community}</span>
            </div>
            <div class="detail-row">
                <span>K-Core</span>
                <span>${node.kcore}</span>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-row">
                <span>In-Degree</span>
                <span>${metrics.in_degree || 0}</span>
            </div>
            <div class="detail-row">
                <span>Out-Degree</span>
                <span>${metrics.out_degree || 0}</span>
            </div>
            <div class="detail-row">
                <span>Total Degree</span>
                <span>${metrics.total_degree || 0}</span>
            </div>
        </div>
        <div class="detail-section metrics-section">
            <div class="detail-row">
                <span>Betweenness</span>
                <span>${(metrics.betweenness || 0).toFixed(6)}</span>
            </div>
            <div class="detail-row">
                <span>Closeness</span>
                <span>${(metrics.closeness || 0).toFixed(6)}</span>
            </div>
            <div class="detail-row">
                <span>Eigenvector</span>
                <span>${(metrics.eigenvector || 0).toExponential(2)}</span>
            </div>
            <div class="detail-row">
                <span>PageRank</span>
                <span>${(metrics.pagerank || 0).toFixed(6)}</span>
            </div>
        </div>
    `;
}

// Node Search functionality
function setupNodeSearch() {
    const searchInput = document.getElementById('nodeSearchInput');
    const searchResults = document.getElementById('nodeSearchResults');
    
    if (!searchInput || !searchResults) return;
    
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        debounceTimer = setTimeout(() => {
            const nodes = state.nodesData?.nodes || [];
            const matches = nodes.filter(node => 
                node.title.toLowerCase().includes(query) || 
                node.id.toString().includes(query)
            ).slice(0, 10); // Limit to 10 results
            
            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item"><span class="result-title">No results found</span></div>';
            } else {
                searchResults.innerHTML = matches.map(node => `
                    <div class="search-result-item" data-node-id="${node.id}">
                        <div class="result-title">${highlightMatch(node.title, query)}</div>
                        <div class="result-meta">ID: ${node.id} | ${node.genre} | Community ${node.community}</div>
                    </div>
                `).join('');
            }
            searchResults.classList.add('active');
        }, 150);
    });
    
    // Handle click on search result
    searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if (!item) return;
        
        const nodeId = item.dataset.nodeId;
        if (!nodeId) return;
        
        // Select and focus on the node in the network
        selectAndFocusNode(nodeId);
        
        // Clear search
        searchInput.value = '';
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
    });
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.node-search-container')) {
            searchResults.classList.remove('active');
        }
    });
    
    // Handle Enter key to select first result
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstResult = searchResults.querySelector('.search-result-item[data-node-id]');
            if (firstResult) {
                const nodeId = firstResult.dataset.nodeId;
                selectAndFocusNode(nodeId);
                searchInput.value = '';
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
            }
        }
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background: #FEF08A; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

function selectAndFocusNode(nodeId) {
    if (!state.networkInstance) return;
    
    // Select the node
    state.networkInstance.selectNodes([nodeId]);
    
    // Focus/zoom to the node
    state.networkInstance.focus(nodeId, {
        scale: 1.5,
        animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad'
        }
    });
    
    // Show node detail
    showNodeDetail(nodeId);
}

function populateLegend(nodes) {
    const legendContainer = document.getElementById('legend-items');
    if (!legendContainer) return;
    
    // Count genres
    const genreCounts = {};
    nodes.forEach(n => {
        const g = n.genre || 'Other';
        genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    
    // Sort by count
    const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1]);
    
    legendContainer.innerHTML = sortedGenres.map(([genre, count]) => {
        const isExcluded = state.excludedGenres.has(genre);
        const isIsolated = state.isolatedGenre === genre;
        
        return `
            <div class="legend-item ${isExcluded ? 'excluded' : ''} ${isIsolated ? 'isolated' : ''}" 
                 data-genre="${genre}"
                 onclick="handleLegendClick('${genre}')"
                 ondblclick="handleLegendDoubleClick('${genre}')">
                <span class="legend-color" style="background: ${GENRE_COLORS[genre] || GENRE_COLORS['Other']}"></span>
                <span class="legend-text">${genre}</span>
                <span class="legend-count">${count}</span>
            </div>
        `;
    }).join('');
}

function handleLegendClick(genre) {
    // Single click = exclude/include genre
    if (state.isolatedGenre) {
        state.isolatedGenre = null;
    }
    
    if (state.excludedGenres.has(genre)) {
        state.excludedGenres.delete(genre);
    } else {
        state.excludedGenres.add(genre);
    }
    
    filterNetwork();
}

function handleLegendDoubleClick(genre) {
    // Double click = isolate/show only this genre
    if (state.isolatedGenre === genre) {
        state.isolatedGenre = null;
        state.excludedGenres.clear();
    } else {
        state.isolatedGenre = genre;
        state.excludedGenres.clear();
    }
    
    filterNetwork();
}

function resetFilters() {
    state.excludedGenres.clear();
    state.isolatedGenre = null;
    filterNetwork();
}

function filterNetwork() {
    if (!state.allNodes || !state.nodesDataSet || !state.networkInstance) return;
    
    // Determine visibility for each node
    const isNodeVisible = (node) => {
        if (state.isolatedGenre) return node.genre === state.isolatedGenre;
        return !state.excludedGenres.has(node.genre);
    };
    
    // Build updates for nodes using hidden property (no animation)
    const nodeUpdates = state.allNodes.map(n => ({
        id: n.id,
        hidden: !isNodeVisible(n)
    }));
    
    // Build set of visible node IDs for edge filtering
    const visibleNodeIds = new Set(
        state.allNodes.filter(isNodeVisible).map(n => n.id)
    );
    
    // Build updates for edges
    const edgeUpdates = state.allEdges.map(e => ({
        id: e.id,
        hidden: !(visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to))
    }));
    
    // Apply updates directly - no physics restart
    state.nodesDataSet.update(nodeUpdates);
    state.edgesDataSet.update(edgeUpdates);
    
    // Update legend UI
    if (state.nodesData) {
        populateLegend(state.nodesData.nodes);
    }
    
    // Update visible count
    updateVisibleCount(visibleNodeIds.size);
}

function updateVisibleCount(count) {
    const el = document.getElementById('stat-visible');
    if (el) {
        if (count !== undefined) {
            el.textContent = count;
        } else if (state.nodesDataSet) {
            // Count non-hidden nodes
            const visibleCount = state.allNodes ? state.allNodes.filter(n => {
                if (state.isolatedGenre) return n.genre === state.isolatedGenre;
                return !state.excludedGenres.has(n.genre);
            }).length : 0;
            el.textContent = visibleCount;
        }
    }
}

function setupNetworkControls() {
    const resetBtn = document.getElementById('resetZoom');
    const physicsBtn = document.getElementById('togglePhysics');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (state.networkInstance && physicsBtn) {
                // Programmatically click physics button twice to reset
                // First click: toggle OFF
                physicsBtn.click();
                setTimeout(() => {
                    // Second click: toggle back ON
                    physicsBtn.click();
                    state.networkInstance.fit({ animation: { duration: 500 } });
                }, 150);
            }
        });
    }
    
    if (physicsBtn) {
        // Set initial state
        physicsBtn.classList.add('active');
        
        physicsBtn.addEventListener('click', () => {
            state.physicsEnabled = !state.physicsEnabled;
            if (state.networkInstance) {
                state.networkInstance.setOptions({ physics: { enabled: state.physicsEnabled } });
            }
            physicsBtn.textContent = state.physicsEnabled ? 'Physics: ON' : 'Physics: OFF';
            physicsBtn.classList.toggle('active', state.physicsEnabled);
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Zoom controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (state.networkInstance) {
                const scale = state.networkInstance.getScale();
                state.networkInstance.moveTo({ scale: scale * 1.3 });
            }
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (state.networkInstance) {
                const scale = state.networkInstance.getScale();
                state.networkInstance.moveTo({ scale: scale / 1.3 });
            }
        });
    }
}

// Make legend handlers global
window.handleLegendClick = handleLegendClick;
window.handleLegendDoubleClick = handleLegendDoubleClick;

// ============================================
// COMMUNITY GRAPH (Slide 6)
// ============================================

function initCommunityGraph() {
    const container = document.getElementById('community-graph');
    if (!container) return;
    
    if (!state.nodesData) {
        loadGraphData();
    }
    if (!state.nodesData) return;
    
    const nodes = state.nodesData.nodes;
    const edges = state.edgesData.edges;
    
    // Color nodes by community
    const visNodes = nodes.map(node => ({
        id: node.id,
        label: '',
        title: `${node.title}\nGenre: ${node.genre}\nCommunity: ${node.community}`,
        color: COMMUNITY_COLORS[node.community % COMMUNITY_COLORS.length],
        group: node.community,
        size: 8
    }));
    
    const visEdges = edges.map((edge, idx) => ({
        id: idx,
        from: edge.source,
        to: edge.target,
        arrows: 'to',
        color: { color: '#CBD5E1', opacity: 0.3 }
    }));
    
    const options = {
        autoResize: false,
        height: '100%',
        width: '100%',
        nodes: {
            shape: 'dot',
            size: 10,
            font: { face: 'Plus Jakarta Sans', size: 12 },
            borderWidth: 2
        },
        edges: { width: 0.5, smooth: { type: 'continuous' } },
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 200 },
            barnesHut: { gravitationalConstant: -2000, centralGravity: 0.3, springLength: 120 }
        },
        interaction: { hover: true, tooltipDelay: 100 }
    };
    
    state.communityNetworkInstance = new vis.Network(
        container,
        { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
        options
    );
    
    setupCommunityControls();
    populateCommunityStats();
}

function setupCommunityControls() {
    document.getElementById('resetCommunityZoom')?.addEventListener('click', () => {
        if (state.communityNetworkInstance) {
            // Toggle physics OFF then ON (community has no physics button, so direct toggle)
            state.communityNetworkInstance.setOptions({ physics: { enabled: false } });
            setTimeout(() => {
                state.communityNetworkInstance.setOptions({ physics: { enabled: false } });
            }, 50);
            setTimeout(() => {
                state.communityNetworkInstance.setOptions({ physics: { enabled: true } });
                state.communityNetworkInstance.fit({ animation: { duration: 500 } });
            }, 200);
        }
    });
    
    // Community Search functionality
    const searchInput = document.getElementById('communitySearchInput');
    const searchBtn = document.getElementById('searchCommunity');
    
    const searchCommunity = () => {
        const communityId = parseInt(searchInput?.value);
        if (isNaN(communityId) || !state.communityNetworkInstance) return;
        
        // Find all nodes in this community
        const nodesInCommunity = state.nodesData?.nodes?.filter(n => n.community === communityId);
        
        if (!nodesInCommunity || nodesInCommunity.length === 0) {
            alert(`Community ${communityId} not found`);
            return;
        }
        
        // Get node IDs
        const nodeIds = nodesInCommunity.map(n => n.id);
        
        // Select and focus on these nodes
        state.communityNetworkInstance.selectNodes(nodeIds);
        state.communityNetworkInstance.fit({
            nodes: nodeIds,
            animation: { duration: 500, easingFunction: 'easeInOutQuad' }
        });
    };
    
    searchBtn?.addEventListener('click', searchCommunity);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchCommunity();
    });
    
    // Modal controls
    document.getElementById('openCommunityStats')?.addEventListener('click', () => {
        document.getElementById('communityModal').classList.add('active');
    });
    
    document.getElementById('closeCommunityModal')?.addEventListener('click', closeModal);
    
    document.getElementById('communityModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'communityModal') closeModal();
    });
}

function closeModal() {
    document.getElementById('communityModal')?.classList.remove('active');
}

// Get community color by ID (consistent coloring)
function getCommunityColor(communityId) {
    return COMMUNITY_COLORS[communityId % COMMUNITY_COLORS.length];
}

// Get contrasting text color (black or white)
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Modal state
let modalState = {
    currentTab: 'summary',
    summaryData: COMMUNITY_SUMMARY_DATA,
    detailsData: [],
    sortColumn: null,
    sortDirection: 'asc',
    searchQuery: '',
    // Pagination state
    summaryPage: 1,
    summaryPerPage: 25,
    detailsPage: 1,
    detailsPerPage: 100
};

function populateCommunityStats() {
    // Build details data from nodes
    buildDetailsData();
    
    // Setup tab switching
    setupModalTabs();
    
    // Setup sorting
    setupTableSorting();
    
    // Setup search
    setupModalSearch();
    
    // Render initial data
    renderSummaryTable();
    renderDetailsTable();
}

function buildDetailsData() {
    if (!state.nodesData?.nodes) return;
    
    modalState.detailsData = state.nodesData.nodes
        .filter(n => n.community >= 0)
        .map(n => ({
            community: n.community,
            id: n.id,
            title: n.title
        }))
        .sort((a, b) => a.community - b.community);
}

function setupModalTabs() {
    const tabs = document.querySelectorAll('.modal-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide content
            document.getElementById('tab-summary').classList.toggle('active', tabName === 'summary');
            document.getElementById('tab-details').classList.toggle('active', tabName === 'details');
            
            modalState.currentTab = tabName;
            modalState.sortColumn = null;
            modalState.sortDirection = 'asc';
            // Reset pagination when switching tabs
            modalState.summaryPage = 1;
            modalState.detailsPage = 1;
        });
    });
}

function setupTableSorting() {
    document.querySelectorAll('.sortable-table th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            
            // Toggle direction if same column
            if (modalState.sortColumn === column) {
                modalState.sortDirection = modalState.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                modalState.sortColumn = column;
                modalState.sortDirection = 'asc';
            }
            
            // Re-render current table
            if (modalState.currentTab === 'summary') {
                renderSummaryTable();
            } else {
                renderDetailsTable();
            }
        });
    });
}

function setupModalSearch() {
    const searchInput = document.getElementById('communitySearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        modalState.searchQuery = e.target.value.toLowerCase();
        // Reset pagination when searching
        modalState.summaryPage = 1;
        modalState.detailsPage = 1;
        
        if (modalState.currentTab === 'summary') {
            renderSummaryTable();
        } else {
            renderDetailsTable();
        }
    });
}

function sortData(data, column, direction) {
    return [...data].sort((a, b) => {
        let valA, valB;
        
        switch(column) {
            case 'community':
                valA = a.community;
                valB = b.community;
                break;
            case 'nodes':
                valA = a.nNode;
                valB = b.nNode;
                break;
            case 'genres':
                valA = a.nGenre;
                valB = b.nGenre;
                break;
            case 'best':
                valA = a.bestNodeDegree || 0;
                valB = b.bestNodeDegree || 0;
                break;
            case 'id':
                valA = parseInt(a.id) || 0;
                valB = parseInt(b.id) || 0;
                break;
            case 'name':
                valA = a.title?.toLowerCase() || '';
                valB = b.title?.toLowerCase() || '';
                return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            default:
                return 0;
        }
        
        return direction === 'asc' ? valA - valB : valB - valA;
    });
}

function renderSummaryTable() {
    const tbody = document.getElementById('summaryTableBody');
    if (!tbody) return;
    
    let data = [...modalState.summaryData];
    
    // Filter by search
    if (modalState.searchQuery) {
        data = data.filter(item =>
            item.bestNodeTitle?.toLowerCase().includes(modalState.searchQuery) ||
            item.community.toString().includes(modalState.searchQuery) ||
            item.members?.includes(modalState.searchQuery)
        );
    }
    
    // Sort if needed
    if (modalState.sortColumn) {
        data = sortData(data, modalState.sortColumn, modalState.sortDirection);
    }
    
    // Pagination
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / modalState.summaryPerPage);
    const startIdx = (modalState.summaryPage - 1) * modalState.summaryPerPage;
    const endIdx = startIdx + modalState.summaryPerPage;
    const paginatedData = data.slice(startIdx, endIdx);
    
    tbody.innerHTML = paginatedData.map(item => {
        const color = getCommunityColor(item.community);
        const textColor = getContrastColor(color);
        const membersArr = item.members?.split(',') || [];
        const membersDisplay = membersArr.length > 5 
            ? membersArr.slice(0, 5).join(', ') + ` +${membersArr.length - 5} more`
            : membersArr.join(', ');
        
        return `
            <tr>
                <td>
                    <span class="community-cell" style="background-color: ${color}; color: ${textColor};">
                        ${item.community}
                    </span>
                </td>
                <td>${item.nNode}</td>
                <td>${item.nGenre}</td>
                <td class="best-product-cell" title="${item.bestNodeTitle}">
                    [${item.bestNodeId}] ${item.bestNodeTitle?.substring(0, 30)}${item.bestNodeTitle?.length > 30 ? '...' : ''} (${item.bestNodeDegree})
                </td>
                <td class="members-cell" title="${item.members}">
                    ${membersDisplay}
                </td>
            </tr>
        `;
    }).join('');
    
    // Render pagination controls
    renderPagination('summary', modalState.summaryPage, totalPages, totalItems);
}

function renderDetailsTable() {
    const tbody = document.getElementById('detailsTableBody');
    if (!tbody) return;
    
    let data = [...modalState.detailsData];
    
    // Filter by search
    if (modalState.searchQuery) {
        data = data.filter(item =>
            item.title?.toLowerCase().includes(modalState.searchQuery) ||
            item.community.toString().includes(modalState.searchQuery) ||
            item.id?.includes(modalState.searchQuery)
        );
    }
    
    // Sort if needed
    if (modalState.sortColumn) {
        data = sortData(data, modalState.sortColumn, modalState.sortDirection);
    }
    
    // Pagination
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / modalState.detailsPerPage);
    const startIdx = (modalState.detailsPage - 1) * modalState.detailsPerPage;
    const endIdx = startIdx + modalState.detailsPerPage;
    const paginatedData = data.slice(startIdx, endIdx);
    
    tbody.innerHTML = paginatedData.map(item => {
        const color = getCommunityColor(item.community);
        const textColor = getContrastColor(color);
        
        return `
            <tr>
                <td>
                    <span class="community-cell" style="background-color: ${color}; color: ${textColor};">
                        ${item.community}
                    </span>
                </td>
                <td>${item.id}</td>
                <td title="${item.title}">${item.title?.substring(0, 50)}${item.title?.length > 50 ? '...' : ''}</td>
            </tr>
        `;
    }).join('');
    
    // Render pagination controls
    renderPagination('details', modalState.detailsPage, totalPages, totalItems);
}

// Pagination rendering function
function renderPagination(tabName, currentPage, totalPages, totalItems) {
    const containerId = tabName === 'summary' ? 'summaryPagination' : 'detailsPagination';
    let container = document.getElementById(containerId);
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'pagination-controls';
        const tabContent = document.getElementById(`tab-${tabName}`);
        if (tabContent) {
            tabContent.appendChild(container);
        }
    }
    
    if (totalPages <= 1) {
        container.innerHTML = `<span class="pagination-info">Showing all ${totalItems} items</span>`;
        return;
    }
    
    const perPage = tabName === 'summary' ? modalState.summaryPerPage : modalState.detailsPerPage;
    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);
    
    let paginationHTML = `
        <div class="pagination-info">
            Showing ${startItem}-${endItem} of ${totalItems} items
        </div>
        <div class="pagination-buttons">
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage('${tabName}', 1)">⏮️ First</button>
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage('${tabName}', ${currentPage - 1})">◀️ Prev</button>
            <span class="pagination-current">Page ${currentPage} of ${totalPages}</span>
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage('${tabName}', ${currentPage + 1})">Next ▶️</button>
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage('${tabName}', ${totalPages})">Last ⏭️</button>
        </div>
    `;
    
    container.innerHTML = paginationHTML;
}

// Change page function (global scope for onclick)
window.changePage = function(tabName, page) {
    if (tabName === 'summary') {
        modalState.summaryPage = page;
        renderSummaryTable();
    } else {
        modalState.detailsPage = page;
        renderDetailsTable();
    }
};

// ============================================
// INFLUENTIAL PRODUCTS TABLE (Slide 7)
// ============================================

function populateInfluentialTable() {
    const container = document.getElementById('influentialTable');
    if (!container || !state.nodesData) return;
    
    const nodes = state.nodesData.nodes;
    
    // Sort nodes by total degree (from metrics)
    const sortedNodes = [...nodes]
        .sort((a, b) => (b.metrics?.total_degree || 0) - (a.metrics?.total_degree || 0))
        .slice(0, 15);
    
    container.innerHTML = sortedNodes.map((node, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td title="${node.title}">${node.title.substring(0, 35)}${node.title.length > 35 ? '...' : ''}</td>
            <td>${node.genre}</td>
            <td>${node.metrics?.total_degree || 0}</td>
            <td>${(node.metrics?.pagerank || 0).toFixed(6)}</td>
        </tr>
    `).join('');
}

// ============================================
// GENRE GRAPH (Slide 8)
// ============================================

// Top 10 genres by DVD count (from data.js)
// Drama:73, Comedy:69, Music Video & Concerts:46, Kids & Family:40,
// Action & Adventure:39, Horror:36, Mystery & Suspense:35,
// Television:24, Documentary:23, Science Fiction & Fantasy:23
const TOP_GENRES = [
    'Drama', 'Comedy', 'Music Video & Concerts', 'Kids & Family',
    'Action & Adventure', 'Horror', 'Mystery & Suspense', 
    'Television', 'Documentary', 'Science Fiction & Fantasy'
];

// Genre graph state
let genreGraphMode = 'default'; // 'default' or 'all'

function initGenreGraph(mode = 'default') {
    const container = document.getElementById('genre-graph');
    if (!container) return;
    
    genreGraphMode = mode;
    
    // Use embedded GENRE_GRAPH_DATA instead of fetching (avoids CORS issues)
    if (typeof GENRE_GRAPH_DATA === 'undefined') {
        console.error('GENRE_GRAPH_DATA not found in data.js');
        container.innerHTML = '<p style="text-align:center;padding:50px;color:#666">Genre correlation data not available</p>';
        return;
    }
    
    const genreData = GENRE_GRAPH_DATA;
    
    // Filter nodes based on mode
    let filteredNodes = genreData.nodes;
    let filteredEdges = genreData.edges;
    
    if (mode === 'default') {
        // Get Top 10 genres
        const top10Nodes = genreData.nodes.filter(node => TOP_GENRES.includes(node.id));
        
        // Calculate Others value (sum of all non-top-10 genres)
        const otherGenres = genreData.nodes.filter(node => !TOP_GENRES.includes(node.id));
        const othersValue = otherGenres.reduce((sum, node) => sum + (node.value || 0), 0);
        
        // Create Others node
        const othersNode = {
            id: 'Others',
            label: 'Others',
            value: othersValue,
            title: `Others: ${othersValue} DVDs (${otherGenres.length} genres)`,
            color: '#94A3B8'
        };
        
        filteredNodes = [...top10Nodes, othersNode];
        
        // Aggregate edges for Others
        const otherGenreIds = new Set(otherGenres.map(n => n.id));
        const top10Ids = new Set(TOP_GENRES);
        
        // Build edge map for aggregation
        const edgeMap = new Map();
        
        genreData.edges.forEach(edge => {
            let from = top10Ids.has(edge.from) ? edge.from : (otherGenreIds.has(edge.from) ? 'Others' : null);
            let to = top10Ids.has(edge.to) ? edge.to : (otherGenreIds.has(edge.to) ? 'Others' : null);
            
            if (from && to) {
                // Normalize edge key (alphabetically sorted)
                const key = [from, to].sort().join('|');
                if (edgeMap.has(key)) {
                    edgeMap.get(key).value += edge.value || 1;
                } else {
                    edgeMap.set(key, { from, to, value: edge.value || 1 });
                }
            }
        });
        
        filteredEdges = Array.from(edgeMap.values()).map(e => ({
            from: e.from,
            to: e.to,
            value: e.value,
            title: `${e.from} ↔ ${e.to}: ${e.value} connections`
        }));
    }
    
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const nodeCount = filteredNodes.length;
    
    // Find max value for node size normalization
    const maxNodeValue = Math.max(...filteredNodes.map(n => n.value || 1));
    
    // Create vis nodes with circular layout positions
    const visNodes = filteredNodes.map((node, index) => {
        // Calculate circular position - start from top (-PI/2)
        const angle = (2 * Math.PI * index) / nodeCount - Math.PI / 2;
        const radius = 250;
        
        // Reduced size sensitivity: base 20, max additional 15
        const normalizedSize = 20 + Math.sqrt((node.value || 1) / maxNodeValue) * 15;
        
        return {
            id: node.id,
            label: node.label,
            title: node.title,
            color: GENRE_COLORS[node.id] || GENRE_COLORS['Other'],
            size: normalizedSize,
            font: { size: 14, color: '#333', face: 'Plus Jakarta Sans' },
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    });
    
    // Find max value for edge width normalization
    const maxValue = Math.max(...filteredEdges.map(e => e.value || 1));
    
    // Create edges (only between visible nodes, filter small connections)
    const visEdges = filteredEdges
        .filter(edge => nodeIds.has(edge.from) && nodeIds.has(edge.to))
        .filter(edge => (edge.value || 1) >= 3)
        .map((edge, idx) => ({
            id: idx,
            from: edge.from,
            to: edge.to,
            width: 1 + Math.sqrt((edge.value || 1) / maxValue) * 6,
            title: edge.title || `${edge.from} ↔ ${edge.to}: ${edge.value} connections`,
            color: { color: '#64748B', opacity: 0.3 + ((edge.value || 1) / maxValue) * 0.5 }
        }));
    
    const options = {
        autoResize: false,
        height: '100%',
        width: '100%',
        nodes: {
            shape: 'dot',
            font: { face: 'Plus Jakarta Sans', size: 14 },
            borderWidth: 2
        },
        edges: {
            smooth: { type: 'continuous' }
        },
        physics: {
            enabled: false // Static circular layout
        },
        interaction: { hover: true, tooltipDelay: 100, zoomView: true, dragView: true }
    };
    
    // Destroy previous instance if exists
    if (state.genreNetworkInstance) {
        state.genreNetworkInstance.destroy();
    }
    
    state.genreNetworkInstance = new vis.Network(
        container,
        { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) },
        options
    );
    
    // Update button states
    updateGenreButtonStates();
}

// Setup controls only once (called from goToSlide)
function setupGenreGraphControlsOnce() {
    // Reset zoom button - just fit to view (physics is disabled for static layout)
    document.getElementById('resetGenreZoom')?.addEventListener('click', () => {
        if (state.genreNetworkInstance) {
            state.genreNetworkInstance.fit({ animation: { duration: 500 } });
        }
    });
    
    // Default view button (Top 10 + Others)
    document.getElementById('genreDefault')?.addEventListener('click', () => {
        if (genreGraphMode !== 'default') {
            initGenreGraph('default');
        }
    });
    
    // All genres button
    document.getElementById('genreAll')?.addEventListener('click', () => {
        if (genreGraphMode !== 'all') {
            initGenreGraph('all');
        }
    });
}

function updateGenreButtonStates() {
    const defaultBtn = document.getElementById('genreDefault');
    const allBtn = document.getElementById('genreAll');
    
    if (defaultBtn && allBtn) {
        if (genreGraphMode === 'default') {
            defaultBtn.classList.add('active');
            allBtn.classList.remove('active');
        } else {
            defaultBtn.classList.remove('active');
            allBtn.classList.add('active');
        }
    }
}

// ============================================
// DIFFUSION SIMULATION (Slide 9)
// ============================================

// Store current diffusion graph type
let currentDiffusionGraph = 'dvd';

function initDiffusionGraph(graphType = 'dvd') {
    const container = document.getElementById('diffusion-graph');
    if (!container) return;
    
    currentDiffusionGraph = graphType;
    
    // Clear previous state
    state.selectedSeeds = [];
    state.activatedNodes = new Set();
    state.diffusionStep = 0;
    
    let nodes, edges;
    
    if (graphType === 'dvd') {
        // DVD Network - use main graph data
        if (!state.nodesData) {
            loadGraphData();
        }
        if (!state.nodesData) return;
        
        nodes = state.nodesData.nodes.map(node => ({
            id: node.id,
            label: '',
            title: `${node.title}\\nClick to select as seed`,
            color: { background: '#CBD5E1', border: '#94A3B8' },
            size: 8
        }));
        
        edges = state.edgesData.edges.map((edge, idx) => ({
            id: idx,
            from: edge.source,
            to: edge.target,
            arrows: 'to',
            color: { color: '#E2E8F0', opacity: 0.5 }
        }));
        
        // Store node info for seed list
        state.diffusionNodeInfo = {};
        state.nodesData.nodes.forEach(n => {
            state.diffusionNodeInfo[n.id] = { title: n.title };
        });
        
    } else {
        // Genre Graph - use genre correlation data
        if (typeof GENRE_GRAPH_DATA === 'undefined') {
            console.error('GENRE_GRAPH_DATA not found');
            return;
        }
        
        let genreNodes = GENRE_GRAPH_DATA.nodes;
        let genreEdges = GENRE_GRAPH_DATA.edges;
        
        if (graphType === 'genre-default') {
            // Top 10 + Others
            const top10Nodes = GENRE_GRAPH_DATA.nodes.filter(n => TOP_GENRES.includes(n.id));
            const otherGenres = GENRE_GRAPH_DATA.nodes.filter(n => !TOP_GENRES.includes(n.id));
            const othersValue = otherGenres.reduce((sum, n) => sum + (n.value || 0), 0);
            
            genreNodes = [...top10Nodes, {
                id: 'Others',
                label: 'Others',
                value: othersValue,
                title: `Others: ${othersValue} DVDs`
            }];
            
            // Aggregate edges
            const otherGenreIds = new Set(otherGenres.map(n => n.id));
            const top10Ids = new Set(TOP_GENRES);
            const edgeMap = new Map();
            
            GENRE_GRAPH_DATA.edges.forEach(edge => {
                let from = top10Ids.has(edge.from) ? edge.from : (otherGenreIds.has(edge.from) ? 'Others' : null);
                let to = top10Ids.has(edge.to) ? edge.to : (otherGenreIds.has(edge.to) ? 'Others' : null);
                
                if (from && to) {
                    const key = [from, to].sort().join('|');
                    if (edgeMap.has(key)) {
                        edgeMap.get(key).value += edge.value || 1;
                    } else {
                        edgeMap.set(key, { from, to, value: edge.value || 1 });
                    }
                }
            });
            
            genreEdges = Array.from(edgeMap.values());
        }
        
        nodes = genreNodes.map(node => ({
            id: node.id,
            label: node.label || node.id,
            title: `${node.label || node.id}\\nClick to select as seed`,
            color: { 
                background: GENRE_COLORS[node.id] || '#94A3B8', 
                border: GENRE_COLORS[node.id] || '#64748B' 
            },
            size: 20 + Math.sqrt((node.value || 1) / 73) * 15,
            font: { size: 12, color: '#333' }
        }));
        
        edges = genreEdges.map((edge, idx) => ({
            id: idx,
            from: edge.from,
            to: edge.to,
            width: Math.max(1, Math.sqrt((edge.value || 1) / 10) * 2),
            color: { color: '#94A3B8', opacity: 0.5 }
        }));
        
        // Store node info for seed list
        state.diffusionNodeInfo = {};
        genreNodes.forEach(n => {
            state.diffusionNodeInfo[n.id] = { title: n.label || n.id };
        });
    }
    
    const nodesDataSet = new vis.DataSet(nodes);
    const edgesDataSet = new vis.DataSet(edges);
    
    // Different physics settings based on graph type
    const physicsSettings = graphType === 'dvd' 
        ? { enabled: true, stabilization: { enabled: true, iterations: 150 }, barnesHut: { gravitationalConstant: -2500, centralGravity: 0.4, springLength: 100 } }
        : { enabled: true, stabilization: { enabled: true, iterations: 100 }, barnesHut: { gravitationalConstant: -3000, centralGravity: 0.5, springLength: 150 } };
    
    const options = {
        autoResize: false,
        height: '100%',
        width: '100%',
        nodes: {
            shape: 'dot',
            size: graphType === 'dvd' ? 12 : 20,
            font: { face: 'Plus Jakarta Sans', size: 12 },
            borderWidth: 2
        },
        edges: { width: 0.5, smooth: { type: 'continuous' } },
        physics: physicsSettings,
        interaction: { hover: true, tooltipDelay: 100 }
    };
    
    // Destroy previous instance
    if (state.diffusionNetworkInstance) {
        state.diffusionNetworkInstance.destroy();
    }
    
    state.diffusionNetworkInstance = new vis.Network(
        container,
        { nodes: nodesDataSet, edges: edgesDataSet },
        options
    );
    
    // Store datasets for manipulation
    state.diffusionNodes = nodesDataSet;
    state.diffusionEdges = edgesDataSet;
    
    // Store raw edges for diffusion algorithm
    state.diffusionRawEdges = edges;
    
    // Click to select seeds
    state.diffusionNetworkInstance.on('click', (params) => {
        if (params.nodes.length > 0 && !state.diffusionRunning) {
            const nodeId = params.nodes[0];
            toggleSeed(nodeId);
        }
    });
    
    setupDiffusionControls();
}

function toggleSeed(nodeId) {
    const idx = state.selectedSeeds.indexOf(nodeId);
    
    if (idx > -1) {
        // Remove seed
        state.selectedSeeds.splice(idx, 1);
        state.diffusionNodes.update({
            id: nodeId,
            color: { background: '#CBD5E1', border: '#94A3B8' }
        });
    } else {
        // Add seed
        state.selectedSeeds.push(nodeId);
        state.diffusionNodes.update({
            id: nodeId,
            color: { background: '#10B981', border: '#059669' }
        });
    }
    
    updateSeedList();
    updateDiffusionStats();
}

function updateSeedList() {
    const container = document.getElementById('seedList');
    
    if (state.selectedSeeds.length === 0) {
        container.innerHTML = '<p class="no-seeds">No seeds selected. Click nodes to add.</p>';
    } else {
        container.innerHTML = state.selectedSeeds.map(id => {
            const nodeInfo = state.diffusionNodeInfo?.[id];
            const displayName = nodeInfo ? nodeInfo.title : id;
            const shortName = displayName.length > 15 ? displayName.substring(0, 15) + '...' : displayName;
            return `
                <span class="seed-tag">
                    ${shortName}
                    <button class="seed-remove" onclick="toggleSeed('${id}')">×</button>
                </span>
            `;
        }).join('');
    }
}

function setupDiffusionControls() {
    // Graph selector
    document.getElementById('diffusionGraph')?.addEventListener('change', (e) => {
        const graphType = e.target.value;
        initDiffusionGraph(graphType);
        updateSeedList();
        updateDiffusionStats();
    });
    
    // Slider values
    document.getElementById('propProbability')?.addEventListener('input', (e) => {
        document.getElementById('propValue').textContent = e.target.value;
    });
    
    document.getElementById('animSpeed')?.addEventListener('input', (e) => {
        document.getElementById('speedValue').textContent = e.target.value + 'ms';
    });
    
    // Control buttons
    document.getElementById('startDiffusion')?.addEventListener('click', startDiffusion);
    document.getElementById('resetDiffusion')?.addEventListener('click', resetDiffusion);
    document.getElementById('clearSeeds')?.addEventListener('click', clearSeeds);
}

function clearSeeds() {
    state.selectedSeeds.forEach(id => {
        state.diffusionNodes.update({
            id: id,
            color: { background: '#CBD5E1', border: '#94A3B8' }
        });
    });
    state.selectedSeeds = [];
    updateSeedList();
    updateDiffusionStats();
}

function resetDiffusion() {
    state.diffusionRunning = false;
    state.activatedNodes = new Set();
    state.diffusionStep = 0;
    
    if (!state.diffusionNodes) return;
    
    // Reset all nodes - get all node IDs from the dataset
    const allNodeIds = state.diffusionNodes.getIds();
    allNodeIds.forEach(nodeId => {
        const isSeed = state.selectedSeeds.includes(nodeId);
        const nodeInfo = state.diffusionNodeInfo?.[nodeId];
        
        // For genre graphs, restore original color
        let defaultColor = { background: '#CBD5E1', border: '#94A3B8' };
        if (currentDiffusionGraph !== 'dvd' && nodeInfo) {
            const genreColor = GENRE_COLORS[nodeId] || '#94A3B8';
            defaultColor = { background: genreColor, border: genreColor };
        }
        
        state.diffusionNodes.update({
            id: nodeId,
            color: isSeed 
                ? { background: '#10B981', border: '#059669' }
                : defaultColor
        });
    });
    
    // Toggle physics OFF then ON to reset layout (double toggle)
    if (state.diffusionNetworkInstance) {
        state.diffusionNetworkInstance.setOptions({ physics: { enabled: false } });
        setTimeout(() => {
            state.diffusionNetworkInstance.setOptions({ physics: { enabled: false } });
        }, 50);
        setTimeout(() => {
            state.diffusionNetworkInstance.setOptions({ physics: { enabled: true } });
            state.diffusionNetworkInstance.fit({ animation: { duration: 500 } });
        }, 200);
    }
    
    updateDiffusionStats();
}

async function startDiffusion() {
    if (state.selectedSeeds.length === 0) {
        alert('Please select at least one seed node by clicking on the graph!');
        return;
    }
    
    if (state.diffusionRunning) return;
    state.diffusionRunning = true;
    
    const probability = parseFloat(document.getElementById('propProbability').value);
    const speed = parseInt(document.getElementById('animSpeed').value);
    
    if (!state.diffusionRawEdges) return;
    
    // Build adjacency list from stored edges
    const adjacency = {};
    state.diffusionRawEdges.forEach(e => {
        // Handle different edge formats (source/target vs from/to)
        const source = e.source || e.from;
        const target = e.target || e.to;
        if (!adjacency[source]) adjacency[source] = [];
        adjacency[source].push(target);
        // For undirected graphs (genre), add reverse edge too
        if (currentDiffusionGraph !== 'dvd') {
            if (!adjacency[target]) adjacency[target] = [];
            adjacency[target].push(source);
        }
    });
    
    // Initialize with seeds
    state.activatedNodes = new Set(state.selectedSeeds);
    let frontier = [...state.selectedSeeds];
    state.diffusionStep = 0;
    
    while (frontier.length > 0 && state.diffusionRunning) {
        state.diffusionStep++;
        const newFrontier = [];
        
        for (const nodeId of frontier) {
            const neighbors = adjacency[nodeId] || [];
            
            for (const neighbor of neighbors) {
                if (!state.activatedNodes.has(neighbor) && Math.random() < probability) {
                    state.activatedNodes.add(neighbor);
                    newFrontier.push(neighbor);
                    
                    // Animate activation
                    state.diffusionNodes.update({
                        id: neighbor,
                        color: { background: '#F59E0B', border: '#D97706' }
                    });
                }
            }
        }
        
        frontier = newFrontier;
        updateDiffusionStats();
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    state.diffusionRunning = false;
}

function updateDiffusionStats() {
    document.getElementById('diffSeeds').textContent = state.selectedSeeds.length;
    document.getElementById('diffActivated').textContent = state.activatedNodes.size;
    
    // Get total from current graph's node count
    const total = state.diffusionNodes ? state.diffusionNodes.length : 0;
    const reach = total > 0 ? ((state.activatedNodes.size / total) * 100).toFixed(1) : 0;
    document.getElementById('diffReach').textContent = reach + '%';
    document.getElementById('diffSteps').textContent = state.diffusionStep;
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initKeyboardNavigation();
    initClickNavigation();
    goToSlide(0);
    document.querySelector('.slide')?.classList.add('active');
    
    console.log('🚀 Presentation initialized!');
    console.log('📌 Use ← → arrow keys to navigate');
    console.log('📊 10 slides available');
}

document.addEventListener('DOMContentLoaded', init);

// Make toggleSeed global for onclick
window.toggleSeed = toggleSeed;
