export type Category = 'arcade' | 'precision' | 'speed' | 'memory' | 'rapid';
export type GameDef = { id:string; name:string; animal:string; category:Category; engine:string; rules:string; controls:string; unit:string; lower:boolean; limit:number; adaptation:boolean };
export const categories: Record<Category,{label:string;short:string;color:string;description:string}> = {
 arcade:{label:'Habilidad y arcade',short:'Arcade',color:'#e5efd8',description:'Un poco de equilibrio. Mucho instinto.'},
 precision:{label:'Precisión y timing',short:'Precisión',color:'#fae8c5',description:'Encuentra ese momento perfecto.'},
 speed:{label:'Velocidad contra reloj',short:'Velocidad',color:'#dceaf8',description:'Cada segundo cuenta.'},
 memory:{label:'Memoria y lógica',short:'Memoria',color:'#eae2f5',description:'Pon a trabajar tu lado más curioso.'},
 rapid:{label:'Rapidez y multitarea',short:'Reflejos',color:'#f7e0da',description:'Ojos atentos, dedos preparados.'}
};
type Row = [string,string,string,string,string?,number?,boolean?];
const rows: Record<Category, Row[]> = {
 arcade:[
 ['Pingüino Escalador','penguin','penguin','Gira alrededor del piolet. Toca cuando apuntes al hielo verde para aterrizar. Un salto centrado da Perfecto y +10 m. Fallar o esperar demasiado termina la partida.','m'],
 ['Púas de Puercoespín','hedgehog','spikes','Dispara la púa móvil a un hueco de la pared. No toques las púas ya clavadas. Cada inserción suma un punto.'],
 ['Lémur Giratorio','lemur','lemur','Mantén pulsado en la zona roja para engancharte al ancla. Suelta cuando apuntes al siguiente tramo. No salgas del camino.'],
 ['Libélula Espacial','dragonfly','asteroids','Guía la libélula entre asteroides. Arrastra o usa las flechas; la dificultad aumenta con la distancia.'],
 ['Armadillo en Picado','armadillo','helix','Gira los anillos arrastrando. Mantén Descender para pasar por los huecos. Evita los segmentos rojos.'],
 ['Rana Saltarina','frog','frog','Ajusta la trayectoria arrastrando y suelta para saltar a la siguiente plataforma. Caer fuera termina la partida.'],
 ['Pulga Botadora','flea','flea','Dibuja una línea debajo de la pulga para que rebote. Encadena rebotes para sumar combos; evita los pinchos.'],
 ['Gallina Aleteadora','chicken','chicken','Toca izquierda o derecha para aletear hacia ese lado. Sube por el desfiladero sin tocar las paredes y compensa el viento.','m'],
 ['Murciélago entre Pinchos','bat','bat','Rebota entre las paredes. Toca para subir y evitar los pinchos que aparecen en cada lateral.'],
 ['Guepardo Derrapante','cheetah','cheetah','Corre por el camino. Toca cuando llegues a cada curva para girar sin salir de la pista.'],
 ['Gorrión Aleteador','sparrow','flappy','Cada toque te impulsa hacia arriba. Cruza los huecos entre columnas sin tocarlas.'],
 ['Abejorro Propulsado','bee','jet','Mantén pulsado para subir y suelta para bajar. Evita los rayos láser y gana altura.','m'],
 ['Erizo Cruzacalles','hedgehog','crossing','Muévete con la cruceta o desliza para cruzar carriles. Evita los coches. Cuenta el avance máximo en 40 segundos.','pt',40],
 ['Foca Malabarista','seal','juggle','Arrastra la foca debajo de la pelota para mantenerla en el aire. Cada golpe suma un punto; no la dejes caer.'],
 ['Castor Lanzador','beaver','knives','Toca para lanzar dientes al tronco giratorio sin golpear los ya clavados. Completa tandas para seguir sumando.'],
 ['Liebre en la Autopista','rabbit','traffic','Cambia entre tres carriles con los botones o deslizando. Esquiva el tráfico; la velocidad aumenta.','m'],
 ['Lobo Lunar','wolf','moon','Mantén para ganar impulso en las pendientes y suelta para saltar. Un despegue Perfecto congela brevemente el reloj.','m',60],
 ['Panda Leñador','panda','timber','Corta bambú desde la izquierda o la derecha. Evita las ramas y corta antes de que se vacíe la barra.'],
 ['Gecko Trepador','gecko','gecko','Toca para saltar de pared a pared. Evita los pinchos y sigue ascendiendo.','m'],
 ['Anguila Eléctrica','eel','eel','Toca para cambiar de dirección en zigzag. Evita las barras de neón y recoge los puntos amarillos.'],
 ['Mantis Cortadora','mantis','slice','Mantén pulsado para cortar cubos verdes y suelta antes de los rojos. Dispones de tres vidas.'],
 ['Serpiente Glotona','snake','snake','Dirige la serpiente con flechas o gestos. Cada fruta alarga la cola y acelera el movimiento. No choques con la cola ni con obstáculos.'],
 ['Flamenco Equilibrista','flamingo','balance','Mueve la base a los lados para equilibrar la espada. Aguanta todo lo que puedas.','s'],
 ['Araña Tejedora','spider','web','Usa Girar para apuntar y Crecer para extender el hilo al siguiente nodo. No sobrepases el nodo ni rompas el hilo.'],
 ['Tucán Balancín','toucan','seesaw','Inclina la balanza para mantener la bola. El tiempo cuenta doble cuando está en la zona central.','s'],
 ['Camaleón Columpio','chameleon','swing','Mantén pulsado para enganchar la lengua al ancla. Suelta para volar hacia la siguiente, evitando columnas y caídas.'],
 ['Canguro Trampolín','kangaroo','jumper','Muévete lateralmente mientras rebotas en plataformas. Sigue subiendo sin caer.'],
 ['Hormiga Zigzag','ant','zigzag','Toca para cambiar la dirección de la hormiga en cada esquina. No te caigas del camino.']
 ],
 precision:[
 ['Ojo de Halcón','hawk','hawk','Detén la aguja en el centro de la barra. Son cinco toques; cuenta la precisión media.','%'],
 ['Medusa a Partes Iguales','jellyfish','cut','Traza un corte recto para separar la proporción indicada: una mitad, un tercio y un cuarto. Cuenta la precisión media de las áreas.','%'],
 ['Gallo Puntual','rooster','clock','Detén el contador en el segundo solicitado. Tres rondas; cuanto menor sea la desviación media, mejor.','s',0,true],
 ['Grillo Rítmico','cricket','rhythm','Observa cuatro pulsos de luz. Después mantén el mismo ritmo con ocho toques sin guía.','%'],
 ['Marmota Cronómetro','marmot','countdown','Observa cómo se vacía la barra y toca exactamente al terminar. Tres rondas; menos desviación es mejor.','s',0,true],
 ['Jirafa Apiladora','giraffe','stack','Suelta los bloques sobre la torre. Lo que sobresale se recorta. Apila durante 40 segundos o hasta perder todo el apoyo.','bloques',40],
 ['Paloma Mensajera','pigeon','stamp','Sella las cartas verdes bajo el matasellos. Acierto +1, centrado +2. Las cartas rojas no deben sellarse: penalizan −1.','pt',60],
 ['Nutria Lanzadora','otter','throw','Arrastra hacia atrás desde la bola y suelta para lanzarla a los flotadores. Ten en cuenta el viento. Cada acierto suma 100 puntos.','pt',60]
 ],
 speed:[
 ['Escarabajo Pelotero','beetle','ballrace','Conduce la bola por el circuito usando el joystick o las flechas. Dos rondas; cuenta tu mejor tiempo.','s',0,true],
 ['Carrera de Galgos','dog','race','Completa dos vueltas pasando por todos los puntos de control. Usa dirección, gas y freno.','s',0,true],
 ['Correcaminos','roadrunner','roadrace','Corre dos vueltas al circuito cenital. Usa izquierda, derecha y freno; pasa por todos los controles.','s',0,true],
 ['Hámster al Volante','hamster','slot','Completa tres vueltas con gas y freno. Reduce la velocidad en las curvas para no salirte; una salida te devuelve al tramo con el reloj en marcha.','s',0,true],
 ['Topo Golfista','mole','golf','Arrastra hacia atrás desde la bola para elegir dirección y potencia. Puedes golpearla mientras se mueve. Emboca antes de 47 segundos.','s',47,true],
 ['Topo Golfista 2','mole','golf2','Emboca en un campo con obstáculos y pendientes. Arrastra desde la bola y suelta para golpear. Límite de 47 segundos.','s',47,true],
 ['Suricatas del Minigolf','meerkat','multigolf','Apunta y elige potencia arrastrando desde la bola. Completa tantos hoyos como puedas en 30 segundos.','hoyos',30],
 ['Ratón de Laberinto','mouse','maze','Inclina el tablero con el joystick o las flechas. Visita tres metas verdes y evita los agujeros.','s',0,true],
 ['Búho Calculador','owl','math','Resuelve cinco operaciones eligiendo entre cuatro respuestas. Cada error añade 2 segundos y debe corregirse.','s',0,true],
 ['Zorro de los Dados','fox','dice','Suma los cuatro dados y escribe la respuesta. Tres rondas; cada error añade 2 segundos.','s',0,true],
 ['Ardilla Contadora','squirrel','numbers','Toca los números del 1 al 16 en orden. Cada toque incorrecto añade 1 segundo.','s',0,true],
 ['Cotorra Telefonista','parrot','phone','Memoriza ocho dígitos durante cuatro segundos y repítelos en el teclado. El tiempo comienza cuando se ocultan. Cada error añade 1 segundo.','s',0,true],
 ['Colibrí Reflejos','hummingbird','reaction','Espera a que se ilumine una casilla y tócala. Tres rondas; cuenta la media de reacción. Anticiparte reinicia la ronda.','s',0,true]
 ],
 memory:[
 ['Trile del Mapache','raccoon','cups','Mira bajo qué vaso está la bola. Sigue los intercambios y elige el vaso correcto. La velocidad aumenta con el nivel.','niveles'],
 ['Cuervo Contacajas','crow','boxes','Observa las cajas durante un instante. Indica cuántas viste usando +, − y Enviar. Un error termina la partida.','niveles'],
 ['Chimpancé Memorión','monkey','chimp','Memoriza los números antes de que se oculten. Toca sus posiciones del primero al último antes del límite.'],
 ['Elefante Memorioso','elephant','simon','Observa una secuencia de flechas y repítela con la cruceta. Cada ronda es más larga.'],
 ['Panal de la Abeja','bee','honey','Memoriza las celdas iluminadas y selecciónalas después. El panal y el patrón crecen con el nivel.'],
 ['Rastro del Caracol','snail','trace','Observa el recorrido y vuelve a trazarlo entre los nodos en el mismo orden.'],
 ['Pulpo Camuflaje','octopus','color','Memoriza el color durante tres segundos. Después recréalo ajustando tono, saturación y brillo.','%'],
 ['Loro Dictado','parrot','dictation','Teclea los dígitos visibles antes de que se acabe el tiempo. Las secuencias se hacen más largas.'],
 ['Burro de Carga','donkey','sokoban','Empuja las cajas hasta los objetivos con la cruceta. Puedes deshacer o reiniciar el nivel. Resuelve niveles durante 60 segundos.','pt',60],
 ['Pitón Pi','snake','pi','Escribe los decimales de π después de 3, en orden. Un punto por dígito; termina al fallar o tras 60 segundos. Mecánica propuesta, no confirmada en el PDF.','pt',60]
 ],
 rapid:[
 ['Bingo de la Oveja','sheep','bingo','Marca en tu cartón los números que hayan salido. Completarlo lo renueva. Tocar un número no extraído resta una de tres vidas.'],
 ['Rinoceronte Rompemuros','rhino','bricks','Arrastra para apuntar y suelta una ráfaga de bolas. Cada golpe reduce la resistencia de los ladrillos. No dejes que lleguen a la base.'],
 ['Sepia Reflejos','cuttlefish','flash','Espera al cambio de color y toca. Acierto +1; anticiparte −1. Suma puntos durante 27 segundos.','pt',27],
 ['Jardín de Luciérnagas','firefly','garden','Gira el haz de luz para guiar las luciérnagas hacia la flor de su color. Suma entregas durante 60 segundos.','pt',60],
 ['Mariposa Pintora','butterfly','match','Iguala el color objetivo ajustando tono y brillo. Cada coincidencia genera un nuevo color. Dispones de 60 segundos.','colores',60],
 ['Cigüeña Repartidora','stork','sort','Envía cada paquete al contenedor de su color con izquierda, arriba o derecha. Suma aciertos durante 60 segundos.','pt',60],
 ['Gato Pianista','cat','piano','Toca las teclas que bajan en las cuatro columnas. No pulses huecos ni dejes pasar una tecla.'],
 ['Oso Encestador','bear','basket','Toca cuando el indicador apunte al aro. La primera canasta inicia 10 segundos; cada acierto añade 2 segundos y aumenta la dificultad.','canastas'],
 ['Pájaro Carpintero','woodpecker','tap','Toca el tronco tantas veces como puedas en 60 segundos. Cada pulsación independiente suma un punto.','toques',60],
 ['Vencejo Veloz','swift','arrows','Desliza en la dirección de una de las cuatro flechas antes de que se agote su barra. Suma aciertos durante 60 segundos.','pt',60],
 ['Golondrina Cazadora','swallow','targets','Toca los objetivos antes de que desaparezcan. Perder uno o tocar fuera resta una de tres vidas.'],
 ['Cangrejo Interruptor','crab','switches','Activa los interruptores antes de que caduquen para reponer la barra de tiempo. Termina cuando se vacía.']
 ]
};
const controls:Record<string,string>={
 snake:'Flechas / WASD · Desliza',crossing:'Flechas / WASD · Cruceta',timber:'← / → · Botones laterales',chicken:'← / → · Botones laterales',traffic:'← / → · Desliza',
 asteroids:'Flechas / WASD · Arrastra',balance:'← / → · Arrastra',seesaw:'← / → · Arrastra',juggle:'← / → · Arrastra',jumper:'← / → · Arrastra',
 golf:'Arrastra desde la bola y suelta',golf2:'Arrastra desde la bola y suelta',multigolf:'Arrastra desde la bola y suelta',throw:'Arrastra desde la bola y suelta',
 cut:'Traza un corte recto',flea:'Dibuja una línea',frog:'Arrastra para apuntar y suelta',bricks:'Arrastra para apuntar y suelta',trace:'Traza el recorrido',
 race:'← / → · ↑ gas · ↓ freno',roadrace:'← / → · ↓ freno',slot:'↑ gas · ↓ freno',ballrace:'Flechas / WASD · Joystick',maze:'Flechas / WASD · Joystick',
 simon:'Flechas / WASD · Cruceta',sokoban:'Flechas / WASD · Cruceta',web:'← girar · Espacio crecer',helix:'← / → girar · Espacio descender',
 color:'Ajusta las barras y confirma',match:'Ajusta las barras',garden:'← / → · Arrastra',sort:'← / ↑ / → · Contenedores',arrows:'Flechas · Desliza',
 jet:'Mantén Espacio o la pantalla',moon:'Mantén y suelta Espacio o la pantalla',swing:'Mantén y suelta Espacio o la pantalla',lemur:'Mantén y suelta Espacio o la pantalla',slice:'Mantén Espacio o la pantalla',
 math:'Toca la respuesta · Teclas 1–4',dice:'Teclado numérico · Enter',phone:'Teclado numérico',dictation:'Teclado numérico',pi:'Teclado numérico',piano:'Teclas A S D F · Toca las teclas',
};
export const games:GameDef[]=Object.entries(rows).flatMap(([category,rs])=>rs.map(([name,animal,engine,rules,unit='pt',limit=0,lower=false])=>({id:name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,animal,category:category as Category,engine,rules,unit,limit,lower,controls:controls[engine]??'Toca la pantalla o pulsa Espacio',adaptation:true})));
export const byId=(id:string)=>games.find(g=>g.id===id)!;
export const formatScore=(g:GameDef,v:number|null)=>v===null?'—':`${new Intl.NumberFormat('es-ES',{maximumFractionDigits:g.unit==='s'?3:g.unit==='%'||g.unit==='m'?1:0}).format(v)} ${g.unit}`;

export function durationLabel(g:GameDef){const labels:Record<string,string>={hawk:'5 toques',cut:'3 cortes',clock:'3 rondas',countdown:'3 rondas',rhythm:'8 toques',reaction:'3 rondas',color:'1 color',math:'5 operaciones',dice:'3 rondas',numbers:'16 números',phone:'8 dígitos',ballrace:'2 rondas',race:'2 vueltas',roadrace:'2 vueltas',slot:'3 vueltas',maze:'3 metas'};return g.limit?`${g.limit} s`:labels[g.engine]??'Hasta que falles'}
