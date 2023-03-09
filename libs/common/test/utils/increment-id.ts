export const autoIncrement: (id?: number) => () => number =
  (id = 0) =>
  (increment = 1) =>
    (id += increment)

export const portGenerator = autoIncrement(3000)
