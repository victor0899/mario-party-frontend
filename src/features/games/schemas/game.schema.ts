import * as Yup from 'yup';

// Create game validation schema
export const createGameSchema = Yup.object().shape({
  group_id: Yup.string()
    .required('Debes seleccionar un grupo'),
  map_id: Yup.string()
    .required('Debes seleccionar un mapa'),
  played_at: Yup.date()
    .max(new Date(), 'La fecha del juego no puede ser en el futuro')
    .required('La fecha del juego es requerida'),
  results: Yup.array()
    .of(
      Yup.object().shape({
        player_id: Yup.string()
          .required('ID del jugador requerido'),
        position: Yup.number()
          .min(1, 'La posición mínima es 1')
          .max(4, 'La posición máxima es 4')
          .integer('La posición debe ser un número entero')
          .required('La posición es requerida'),
        stars: Yup.number()
          .min(0, 'Las estrellas no pueden ser negativas')
          .max(99, 'Máximo 99 estrellas')
          .integer('Las estrellas deben ser un número entero')
          .required('Las estrellas son requeridas'),
        coins: Yup.number()
          .min(0, 'Las monedas no pueden ser negativas')
          .max(999, 'Máximo 999 monedas')
          .integer('Las monedas deben ser un número entero')
          .required('Las monedas son requeridas'),
        minigames_won: Yup.number()
          .min(0, 'Los minijuegos ganados no pueden ser negativos')
          .max(50, 'Máximo 50 minijuegos')
          .integer('Los minijuegos ganados deben ser un número entero')
          .default(0),
        showdown_wins: Yup.number()
          .min(0, 'Las victorias en duelos no pueden ser negativas')
          .max(10, 'Máximo 10 victorias en duelos')
          .integer('Las victorias en duelos deben ser un número entero')
          .default(0),
        items_bought: Yup.number()
          .min(0, 'Los objetos comprados no pueden ser negativos')
          .max(20, 'Máximo 20 objetos comprados')
          .integer('Los objetos comprados deben ser un número entero')
          .default(0),
        items_used: Yup.number()
          .min(0, 'Los objetos usados no pueden ser negativos')
          .max(20, 'Máximo 20 objetos usados')
          .integer('Los objetos usados deben ser un número entero')
          .default(0),
        spaces_traveled: Yup.number()
          .min(0, 'Los espacios recorridos no pueden ser negativos')
          .max(200, 'Máximo 200 espacios recorridos')
          .integer('Los espacios recorridos deben ser un número entero')
          .default(0),
        reactions_used: Yup.number()
          .min(0, 'Las reacciones usadas no pueden ser negativas')
          .max(50, 'Máximo 50 reacciones usadas')
          .integer('Las reacciones usadas deben ser un número entero')
          .default(0),
        blue_spaces: Yup.number()
          .min(0, 'Los espacios azules no pueden ser negativos')
          .max(100, 'Máximo 100 espacios azules')
          .integer('Los espacios azules deben ser un número entero')
          .default(0),
        red_spaces: Yup.number()
          .min(0, 'Los espacios rojos no pueden ser negativos')
          .max(50, 'Máximo 50 espacios rojos')
          .integer('Los espacios rojos deben ser un número entero')
          .default(0),
        lucky_spaces: Yup.number()
          .min(0, 'Los espacios de suerte no pueden ser negativos')
          .max(20, 'Máximo 20 espacios de suerte')
          .integer('Los espacios de suerte deben ser un número entero')
          .default(0),
        unlucky_spaces: Yup.number()
          .min(0, 'Los espacios de mala suerte no pueden ser negativos')
          .max(20, 'Máximo 20 espacios de mala suerte')
          .integer('Los espacios de mala suerte deben ser un número entero')
          .default(0),
        item_spaces: Yup.number()
          .min(0, 'Los espacios de objetos no pueden ser negativos')
          .max(20, 'Máximo 20 espacios de objetos')
          .integer('Los espacios de objetos deben ser un número entero')
          .default(0),
        bowser_spaces: Yup.number()
          .min(0, 'Los espacios de Bowser no pueden ser negativos')
          .max(10, 'Máximo 10 espacios de Bowser')
          .integer('Los espacios de Bowser deben ser un número entero')
          .default(0),
        event_spaces: Yup.number()
          .min(0, 'Los espacios de eventos no pueden ser negativos')
          .max(20, 'Máximo 20 espacios de eventos')
          .integer('Los espacios de eventos deben ser un número entero')
          .default(0),
        vs_spaces: Yup.number()
          .min(0, 'Los espacios VS no pueden ser negativos')
          .max(10, 'Máximo 10 espacios VS')
          .integer('Los espacios VS deben ser un número entero')
          .default(0)
      })
    )
    .min(2, 'Debe haber al menos 2 resultados')
    .max(4, 'Máximo 4 resultados')
    .required('Los resultados son requeridos')
    .test('unique-positions', 'Las posiciones deben ser únicas', function(results) {
      if (!results) return true;
      const positions = results.map((result: any) => result.position);
      return new Set(positions).size === positions.length;
    })
    .test('consecutive-positions', 'Las posiciones deben ser consecutivas empezando desde 1', function(results) {
      if (!results) return true;
      const positions = results.map((result: any) => result.position).sort();
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] !== i + 1) {
          return false;
        }
      }
      return true;
    })
});

export type CreateGameFormValues = Yup.InferType<typeof createGameSchema>;

// Vote game validation schema
export const voteGameSchema = Yup.object().shape({
  game_id: Yup.string()
    .required('ID del juego requerido'),
  vote: Yup.string()
    .oneOf(['approve', 'reject'], 'El voto debe ser "approve" o "reject"')
    .required('El voto es requerido')
});

export type VoteGameFormValues = Yup.InferType<typeof voteGameSchema>;

// Game filter validation schema
export const gameFilterSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(['pending', 'approved', 'rejected', 'all'], 'Estado inválido')
    .default('all'),
  map_id: Yup.string()
    .optional(),
  date_from: Yup.date()
    .optional(),
  date_to: Yup.date()
    .min(Yup.ref('date_from'), 'La fecha final debe ser posterior a la fecha inicial')
    .optional(),
  player_id: Yup.string()
    .optional()
});

export type GameFilterFormValues = Yup.InferType<typeof gameFilterSchema>;