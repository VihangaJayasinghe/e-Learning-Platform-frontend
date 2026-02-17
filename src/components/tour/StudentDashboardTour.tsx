import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
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
            target: '.tour-welcome',
            placement: 'center',
            content: (
                <div className="text-center p-2">
                    <h2 className="text-xl font-bold text-teal-600 mb-2">Welcome to Your Dashboard!</h2>
                    <p className="text-gray-600">
                        This is your central hub for learning. Let's take a quick look around.
                    </p>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '.tour-learning',
            content: 'Access all your enrolled courses, certificates, and continue your lessons from here.',
        },
        {
            target: '.tour-activity',
            content: 'Quickly jump back into your most recent activity.',
        },
        {
            target: '.tour-catalog',
            content: 'Explore our course catalog to find new topics and expand your skills.',
        },
        {
            target: '.tour-profile',
            content: 'Manage your account settings, password, and security here.',
        },
        // Add more steps as needed based on actual dashboard content
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
