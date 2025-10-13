import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categories, getCategoryIcon } from "../constants";

export default function FilterBox({sort} : any) {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const [formData, setFormData] = useState({
        category: "All Categories",
        sort: "Newest First"
    });

    function handleInputChange(name: string, value: any) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <View style={styles.container}>
            <View style={styles.category} >
                <TouchableOpacity style={styles.categoryTouchable} onPress={() => { setShowCategoryDropdown((value) => !value) }}>
                    <FontAwesome6 name={getCategoryIcon(formData.category)} style={styles.categoryIcon} solid />
                    <Text numberOfLines={1} style={styles.categoryText}>{formData.category}</Text>
                    <FontAwesome6 name="caret-down" style={styles.categoryDropdownIcon} solid />
                </TouchableOpacity>
                {showCategoryDropdown && (
                    <View style={[styles.dropdown, {width: 220, left: 0}]}>
                        {["All Categories", ...categories].map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={(cat == formData.category) ? styles.dropdownItemActive : styles.dropdownItem}
                                onPress={() => {
                                    handleInputChange("category", cat);
                                    setShowCategoryDropdown(false);
                                }}
                            >
                                <FontAwesome6 name={getCategoryIcon(cat)} style={(cat == formData.category) ? styles.dropdownIconActive : styles.dropdownIcon} solid />
                                <Text style={(cat == formData.category) ? styles.dropdownTextActive : styles.dropdownText}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.category} >
                <TouchableOpacity style={styles.categoryTouchable} onPress={() => { setShowSortDropdown((value) => !value) }}>
                    <Text numberOfLines={1} style={styles.categoryText}>{formData.sort}</Text>
                    <FontAwesome6 name="caret-down" style={styles.categoryDropdownIcon} solid />
                </TouchableOpacity>
                {showSortDropdown && (
                    <View style={[styles.dropdown, {width: 130, right: 0}]}>
                        {sort.map((cat: any) => (
                            <TouchableOpacity
                                key={cat}
                                style={(cat == formData.category) ? styles.dropdownItemActive : styles.dropdownItem}
                                onPress={() => {
                                    handleInputChange("category", cat);
                                    setShowSortDropdown(false);
                                }}
                            >
                                <Text style={(cat == formData.category) ? styles.dropdownTextMarginActive : styles.dropdownTextMargin}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginVertical: 4,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    category: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        maxWidth: '100%',
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        position: "relative",
        margin: 6
    },
    categoryTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryText: {
        color: "rgba(0,0,0,0.6)",
        fontWeight: "bold",
        fontSize: 13,
        maxWidth: 120
    },
    categoryIcon: {
        color: "rgba(0,0,0,0.6)",
        fontSize: 14
    },
    categoryDropdownIcon: {
        color: "rgba(0,0,0,0.6)",
        fontSize: 14
    },
    dropdown: {
        position: "absolute",
        top: 30,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 12,
        zIndex: 999,
        padding: 8,
        // shadowColor: "#000",
        // shadowOpacity: 0.1,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
        // elevation: 1,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 2
    },
    dropdownItemActive: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 2,
        borderRadius: 8
    },
    dropdownIcon: {
        width: 30,
        textAlign: 'center',
        color: 'rgba(0,0,0,0.6)'
    },
    dropdownIconActive: {
        width: 30,
        textAlign: 'center',
        color: '#FF6600'
    },
    dropdownText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.8)',
        margin: 2
    },
    dropdownTextActive: {
        fontSize: 13,
        color: '#FF6600',
        fontWeight: 'bold',
        margin: 2
    },
    dropdownTextMargin: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.8)',
        margin: 2,
        marginHorizontal: 8
    },
    dropdownTextMarginActive: {
        fontSize: 13,
        color: '#FF6600',
        fontWeight: 'bold',
        margin: 2,
        marginHorizontal: 8
    },
})