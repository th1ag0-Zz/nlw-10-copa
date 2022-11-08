import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    '/pools/:poolId/games/:gameId',
    { onRequest: [authenticate] },
    async (req, res) => {
      const createGuessParams = z.object({
        poolId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { gameId, poolId } = createGuessParams.parse(req.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(req.body);

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: req.user.sub,
          },
        },
      });

      if (!participant) {
        return res.status(400).send({
          message: 'You are not allowed to create guess inside pool',
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return res.status(400).send({
          message: 'error',
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return res.status(400).send({
          message: 'error',
        });
      }

      if (game.data < new Date()) {
        return res.status(400).send({
          message: 'error',
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return res.status(201).send();
    }
  );
}
