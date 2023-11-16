const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

const create = async (req, res) => {
  try {
    const result = await prisma.user.create({
      data: {
        ...req.body,
      },
    });

    const user = { ...result };
    delete user.hashPassword;

    res.status(201).json(user);
  } catch (err) {
    console.error(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      //Foreign key constraint failed on the field
      if (err.code == "P2003") {
        res.sendStatus(404);
      }
      // Unique constraint failed on the {constraint}
      if (err.code == "P2002") {
        res.status(400).send("Le pseudo ou l'adresse email existe déjà");
      } else {
        res.sendStatus(500);
      }
    }
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        ...req.body,
      },
    });

    res.sendStatus(204);
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // An operation failed because it depends on one or more records that were required but not found. {cause}
      if (e.code == "P2025") {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    }
  }
};

const readById = async (req, res) => {
  const { id } = req.params;

  try {
    const customers = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
      },
    });

    if (customers) {
      res.json(customers);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.sendStatus(204);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // An operation failed because it depends on one or more records that were required but not found. {cause}
      if (e.code == "P2025") {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    }
  }
};

module.exports = {
  create,
  update,
  readById,
  deleteById,
};