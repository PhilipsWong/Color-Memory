import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Spacer = ({ display, width, height, borderStyle, borderColor }) => {
    const borderWidth = display !== undefined && !display ? 0 : 1;
    width = width !== undefined && width ? width : wp * 0.9;
    marginVertical = height !== undefined && height ? height : 15;
    borderColor = borderColor !== undefined && borderColor ? borderColor : 'rgba(230,230,230,1)';
    borderStyle = borderStyle !== undefined && borderStyle ? borderStyle : null;

    return (
        <View style={[styles.spacer, { borderWidth, width, marginVertical, borderColor, borderStyle }]} />
    );
};

const styles = StyleSheet.create({
    spacer: {
        borderRadius: 10,
        alignSelf: 'center'
    },

});

export default Spacer;
