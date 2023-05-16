import { provider } from '../config/init-pact.js';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers/AnimalsController.js';
import { expect } from 'chai';

describe('Animal Service', () => {
    describe('When a request to delete an animal is made', () => {
        before(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to delete an animal',
                state: "there are animals for deletion",
                withRequest: {
                    method: 'DELETE',
                    path: Matchers.string('/animals/{name}')
                },
                willRespondWith: {
                    status: 204
                }
            });
        });

        after(() => provider.finalize());
        
        it('should return the correct data', async () => {
            const response = await AnimalController.delete("Popeye");
            
            // Verifying response status as "No content (204)"
            expect(response.status).to.be.eql(204);
            
            await provider.verify()
        });
    });
});