import React, { useState, useRef, useEffect } from 'react';

export default function SOS({ contacts = ['+1234567890'] }) {
    const [arming, setArming] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [callingIndex, setCallingIndex] = useState(-1);
    const intervalRef = useRef(null);
    const timeoutRefs = useRef([]);

    useEffect(() => {
        if (arming && countdown === 0) makeCalls();
    }, [arming, countdown]);

    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            timeoutRefs.current.forEach(t => clearTimeout(t));
        };
    }, []);

    function startCountdown() {
        if (arming) return;
        setArming(true);
        setCountdown(5);
        intervalRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    }

    function cancelCountdown() {
        clearInterval(intervalRef.current);
        timeoutRefs.current.forEach(t => clearTimeout(t));
        timeoutRefs.current = [];
        setArming(false);
        setCountdown(5);
        setCallingIndex(-1);
    }

    function makeCalls() {
        contacts.forEach((num, i) => {
            const t = setTimeout(() => {
                setCallingIndex(i);
                window.open(`tel:${num}`, '_self');
            }, i * 2000);
            timeoutRefs.current.push(t);
        });
        const finishTimer = setTimeout(() => {
            setArming(false);
            setCountdown(5);
            setCallingIndex(-1);
            timeoutRefs.current = [];
        }, contacts.length * 2000 + 1000);
        timeoutRefs.current.push(finishTimer);
    }

    // place button at the right-bottom corner of the page
    const containerStyle = {
        position: 'fixed',
        right: 12,
        bottom: 12,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'auto'
    };

    const btnStyle = {
        width: 66,
        height: 66,
        borderRadius: 44,
        background: '#d32f2f',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        fontSize: 13,
        padding: 0,
    };

    const smallStyle = {
        fontSize: 12,
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '4px 6px',
        borderRadius: 6,
        whiteSpace: 'nowrap'
    };

    return (
        <div style={containerStyle} aria-hidden={false}>
            <button
                style={btnStyle}
                onClick={startCountdown}
                disabled={arming}
                aria-label="SOS emergency"
                title="SOS - press to start 5s countdown"
            >
                SOS
            </button>

            {arming && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={smallStyle}>Calling in {countdown}s</div>
                    <button
                        onClick={cancelCountdown}
                        style={{ padding: '4px 6px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {!arming && callingIndex >= 0 && (
                <div style={smallStyle}>Calling {contacts[callingIndex]}</div>
            )}
        </div>
    );
}