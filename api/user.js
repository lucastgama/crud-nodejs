const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (req, res, next) => {
    const user = { ...req.body };

    if (req.params.id) user.id = req.params.id;

    try {
      existsOrError(user.name, "Nome não informado");
      existsOrError(user.email, "E-mail não informado");
      existsOrError(user.password, "Senha não informada");
      existsOrError(user.confirmPassword, "Confirmação de Senha inválida");
      equalsOrError(user.password, user.confirmPassword, "Senhas não conferem");

      const userFromDb = await app
        .db("users")
        .where({ email: user.email })
        .first();
      if (!user.id) {
        notExistsOrError(userFromDb, "Usuário já cadastrado");
      }
    } catch (error) {
      return res.status(400).send(error);
    }

    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("users")
        .insert(user)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const get = (req, res) => {
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).send(err));
  };

  const getById = (req, res) => {
    const userId = req.params.id;
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .where("id", userId)
      .first()
      .then((user) => res.json(user))
      .catch((err) => {
        res.status(500).send(err);
      });
  };

  return { save, get, getById };
};
