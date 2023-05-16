import { provider } from '../config/init-pact.js';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers/AnimalsController.js';
import { expect } from 'chai';

describe('Animal Service - Register animal', () => {
    describe('When a request to register a cat is made', () => {
        before(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to register an animal',
                state: "there are no animals",
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    body: Matchers.somethingLike({
                        name: Matchers.like("Popeye"),
                        breed: Matchers.like("Azul Ruso"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(true)
                    })
                },
                willRespondWith: {
                    status: 201,
                    body: Matchers.somethingLike({
                        name: Matchers.like("Popeye"),
                        breed: Matchers.like("Azul Ruso"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(true)
                    })
                }
            });
        });

        after(() => provider.finalize());

        it('should return the correct data', async () => {
            const popeye = {
                name: "Popeye",
                breed: "Azul Ruso",
                gender: "Male",
                vaccinated: true
            }

            const response = await AnimalController.register(popeye);
            const responseBody = response.data;

            // Verifying response is not undefined
            expect(responseBody).to.not.be.undefined;

            // Verifying response status to be "Created"
            expect(response.status).to.be.eql(201);

            // Verifying data properties within response
            expect(responseBody).to.have.property('name');
            expect(responseBody).to.have.property('breed');
            expect(responseBody).to.have.property('gender');
            expect(responseBody).to.have.property('vaccinated');

            // Verifying response data is equal to expected data
            expect(responseBody).to.be.eql(popeye);

            await provider.verify()
        });
    });
});