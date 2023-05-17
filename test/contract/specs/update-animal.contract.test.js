import { provider } from '../config/init-pact.js';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers/AnimalsController.js';
import { expect } from 'chai';

describe('Animal Service', () => {
    describe('When a request to update an animal is made', () => {
        before(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to update an animal',
                state: "there are animals to update",
                withRequest: {
                    method: 'PUT',
                    path: Matchers.string('/animals/{name}'),
                    body: Matchers.somethingLike({
                        name: Matchers.like("Popeye"),
                        breed: Matchers.like("Azul Ruso"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(true)
                    })
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.somethingLike({
                        name: Matchers.like("Popeye"),
                        breed: Matchers.like("Azul Ruso"),
                        gender: Matchers.like("Male"),
                        vaccinated: Matchers.boolean(false),
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
                vaccinated: false
            }

            const response = await AnimalController.updateAnimal("Popeye",popeye);
            const responseBody = response.data;

            // Verifying response to not be undifined and return 200 status
            expect(responseBody).to.not.be.undefined;
            expect(response.status).to.be.eql(200);

            // Verifying data within response array
            expect(responseBody.name).to.be.equal('Popeye');
            expect(responseBody.breed).to.be.equal('Azul Ruso');
            expect(responseBody.gender).to.be.equal('Male');
            expect(responseBody.vaccinated).to.be.false;


            await provider.verify()
        });
    });
});