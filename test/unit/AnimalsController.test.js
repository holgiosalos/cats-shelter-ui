import { expect } from 'chai';
import moxios from 'moxios';
import { AnimalController, axiosInstance } from '../../controllers/AnimalsController.js';

describe('Animal Controller Unit Tests', () => {
    
    beforeEach(async () => {
        moxios.install(axiosInstance);
    });

    afterEach(() => {
        moxios.uninstall(axiosInstance);
    });

    it('Test Register Animal', async () => {
        const animalToRegister = {
            name: "manchas",
            breed: "Bengali",
            gender: "Female",
            vaccinated: true
        }
        
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 201,
                response: animalToRegister,
            });
        });

        const actualResponse = await AnimalController.register(animalToRegister);

        expect(actualResponse.status).to.be.eql(201);
        expect(actualResponse.data).to.be.eql(animalToRegister);
    })

    it('Test List Animal', async () => {
        const animalList = [{
            name: "manchas",
            breed: "Bengali",
            gender: "Female",
            vaccinated: true
        },
        {
            name: "popeye",
            breed: "Azul Ruso",
            gender: "Male",
            vaccinated: true
        },
    ]
        
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: animalList,
            });
        });

        const actualResponse = await AnimalController.list();

        expect(actualResponse.status).to.be.eql(200);
        expect(actualResponse.data).to.be.eql(animalList);
    })

    it('Test Get Animal', async () => {
        const animalToGet = {
            name: "mortadelo",
            breed: "Corgi",
            gender: "Male",
            vaccinated: false
        }
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: animalToGet,
            });
        });

        const actualResponse = await AnimalController.getAnimal(animalToGet.name);

        expect(actualResponse.status).to.be.eql(200);
        expect(actualResponse.data).to.be.eql(animalToGet);
    });

    it('Test Delete Animal', async () => {
        const animalToDelete = "popeye";
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 204,
            });
        });

        const actualResponse = await AnimalController.delete(animalToDelete);

        expect(actualResponse.status).to.be.eql(204);
    });

    it('Test Update Animal', async () => {
        const animalToUpdate = {
            name: "miku",
            breed: "Shiba Inu",
            gender: "Female",
            vaccinated: true
        }
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: animalToUpdate,
            });
        });

        const actualResponse = await AnimalController.updateAnimal(animalToUpdate.name);

        expect(actualResponse.status).to.be.eql(200);
        expect(actualResponse.data).to.be.eql(animalToUpdate);
    });
})