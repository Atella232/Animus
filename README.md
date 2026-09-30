# Animus

App web en español con 71 minijuegos animales, entrenamiento ilimitado, reto diario individual y estadísticas locales. Diseño adaptable a móvil y ordenador, con ilustraciones vectoriales propias.

## Abrir y ejecutar

Necesitas Node.js 20.19+ o 22.12+ y pnpm.

```sh
pnpm install
pnpm dev
```

Abre http://localhost:5173. Para la versión instalable y el funcionamiento sin conexión:

```sh
pnpm build
pnpm preview
```

Abre http://localhost:4173. Espera a que termine la primera carga conectado. El instalador almacena también el módulo de juegos, aunque todavía no hayas abierto una partida. En móvil usa «Añadir a pantalla de inicio»; el botón de instalación aparece en Ajustes cuando el navegador lo ofrece. Para instalar desde otros dispositivos sirve el directorio `dist/` con HTTPS.

## Jugar

Entrenamiento contiene los 71 juegos. Puedes buscar, filtrar por categoría y añadir favoritos. La ficha muestra reglas, duración, controles y récord. Toca, arrastra o usa los botones; en ordenador funcionan teclado y ratón.

El reto rota cada día en Europe/Madrid. Hay dos intentos oficiales, con la misma semilla. Entrenar no consume intentos. Salir o recargar consume el intento empezado; el siguiente inicio registra la interrupción como abandono. Ocultar la pestaña pausa el entrenamiento y abandona el reto diario. Los juegos de supervivencia no tienen un límite global de tiempo.

Estadísticas separa entrenamiento y reto, respeta si más o menos es mejor y excluye abandonos de récords y medias. Las pruebas de tiempo que no se completan no producen una marca válida. En Ajustes se exporta e importa una copia JSON, combinando partidas sin duplicados. El progreso no se sincroniza entre dispositivos; borrar los datos del navegador lo elimina.

## Reglas y adaptaciones

Referencia: «Minijuegos animales - reglas.pdf», facilitado por el usuario. Todas las escenas son adaptaciones 2D propias; no contienen assets del juego original. Las duraciones, penalizaciones y tolerancias ausentes del documento están definidas en esta versión. Pitón Pi sigue la interpretación propuesta (decimales de π), indicada como no confirmada en su ficha.

Los circuitos 3D se representan en vista cenital. Los saltos, anclas y recorridos usan escenas estilizadas; las familias comparten herramientas y algunos recorridos, manteniendo controles y condiciones específicas. No se incluyen grupos, cuentas, anuncios, monedas, clasificaciones globales ni referencias de «Top 1 %» sin verificar.

## Verificación

```sh
pnpm build
pnpm test
```

Pruebas de los 71 motores, entradas mixtas, puntuación, colisiones, precisión, memoria, tiempo de preparación, ciclo diario, horario de Madrid, guardado atómico, importación y caché sin conexión. La prueba del service worker necesita una compilación previa.

React + TypeScript + Vite para la interfaz; Phaser para las escenas; IndexedDB para partidas y ajustes. `src/catalog.ts` define las reglas; `src/games/` contiene los motores; `src/model.ts` centraliza estadísticas y validación; `src/storage.ts` gestiona persistencia.
