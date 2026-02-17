import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, type CallBackProps, type Step } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const StudentDashboardTour: React.FC = () => {
    const [run, setRun] = useState(false);
    const location = useLocation();

    // Only run on the main dashboard page
    useEffect(() => {
        if (location.pathname === '/dashboard') {
            // Check if user has already seen the tour
            const tourSeen = localStorage.getItem('student_dashboard_tour_seen');
            if (!tourSeen) {
                setRun(true);
            }
        } else {
            setRun(false);
        }
    }, [location.pathname]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('student_dashboard_tour_seen', 'true');
        }
    };

    const steps: Step[] = [
        {
            target: 'body',
            placement: 'center',
            content: (
                <div className="text-center p-2">
                    <h2 className="text-xl font-bold text-teal-600 mb-2">Welcome to your Dashboard!</h2>
                    <p className="text-gray-600">
                        We're glad to have you here. Use the sidebar to navigate through your customized learning experience.
                    </p>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '.tour-sidebar-classes',
            content: 'View your enrolled classes and continue your learning journey.',
            placement: 'right'
        },
        {
            target: '.tour-sidebar-browse',
            content: 'Browse our catalog to find new courses and expand your skills.',
            placement: 'right'
        },
        {
            target: '.tour-sidebar-payments',
            content: 'Track your payment history and manage your subscriptions.',
            placement: 'right'
        },
        {
            target: '.tour-sidebar-profile',
            content: 'Update your personal details and account settings.',
            placement: 'right'
        }
    ];

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            styles={{
                options: {
                    primaryColor: '#0d9488', // Teal-600
                    textColor: '#1f2937',
                    zIndex: 10000,
                },
                buttonNext: {
                    fontWeight: 'bold',
                    borderRadius: '0.5rem',
                },
                buttonSkip: {
                    color: '#6b7280',
                }
            }}
            callback={handleJoyrideCallback}
        />
    );
};

export default StudentDashboardTour;
