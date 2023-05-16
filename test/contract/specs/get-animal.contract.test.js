import { provider } from '../config/init-pact.js';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers/AnimalsController.js';
import { expect } from 'chai';

describe('Animal Service', () => {
    describe('When a request to get an animal is made', () => {
        before(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to get an animal',
                state: "there are animals to get",
                withRequest: {
                    method: 'GET',
                    path: Matchers.string('/animals/{name}')
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike({
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

            const response = await AnimalController.getAnimal("Popeye");
            const responseBody = response.data;

            // Verifying response is not undefined
            expect(responseBody).to.not.be.undefined;

            // Verifying data properties within response
            var cat = responseBody[0];
            expect(cat.name).to.be.equal('Popeye');
            expect(cat.breed).to.be.equal('Azul Ruso');
            expect(cat.gender).to.be.equal('Male');
            expect(cat.vaccinated).to.be.true;

            await provider.verify()
        });
    });
});