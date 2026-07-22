import { notificationsApi } from "../../../api/api";

export const notificationService = {
    async getAll(status = "all") {
        return await notificationsApi.list(status);
    },

    async create(title, message) {
        return await notificationsApi.create({
            title,
            message,
        });
    },

    async generateAgenda() {
        return await notificationsApi.generateReminders();
    },

    async markAsSent(id) {
        return await notificationsApi.markSent(id);
    },
};

export default notificationService;