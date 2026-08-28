import type { LinkingOptions } from '@react-navigation/native';

import type { MainTabParamList } from './MainTabs';

export const linking: LinkingOptions<MainTabParamList> = {
    prefixes: [
        'amrutam://',
        'https://app.amrutam.example',
    ],

    config: {
        screens: {
            Consultation: {
                screens: {
                    Doctors: 'consultation',
                    DoctorDetails: 'consultation/doctor/:doctorId',
                    BookingConfirmation: 'consultation/booking/:slotId',
                    UpcomingConsultations: 'consultation/upcoming',
                },
            },

            Shop: {
                screens: {
                    Products: 'shop',
                    ProductDetails: 'shop/product/:productId',
                    Wishlist: 'shop/wishlist',
                    Cart: 'shop/cart',
                    Checkout: 'shop/checkout',
                },
            },

            HealthRecords: {
                screens: {
                    HealthRecords: 'health-records',
                    HealthRecordDetails: 'health-records/:recordId',
                },
            },

            Settings: 'settings',
        },
    },
};
