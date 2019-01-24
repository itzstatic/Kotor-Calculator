import dialogPromise from '../dialog'
import axios from 'axios'
import { ClassId } from '../enums'

export default (async() => {
    const http = axios.create({
        baseURL: '/static/2da'
        , responseType: 'document'
    })

    const [dialog, skills, feats, featGains, powers, powerGains, classes] = 
    (await Promise.all([
        dialogPromise
        , http.get('skills.xml').then(response => response.data)
        , http.get('feat.xml').then(response => response.data)
        , http.get('featgain.xml').then(response => response.data)
        , http.get('spells.xml').then(response => response.data)
        , http.get('classpowergain.xml').then(response => response.data)
        , http.get('classes.xml').then(response => response.data)
    ]))

    function getSkills() {
        const attributeMap = {
            'STR' : 0,
            'DEX' : 1,
            'CON' : 2,
            'INT' : 3,
            'WIS' : 4,
            'CHA' : 5
        }
        return Array.from(skills.firstChild.children).map(skill => ({
            name: dialog.t(skill.querySelector('name').textContent)
            , description: dialog.t(skill.querySelector('description').textContent)
            , icon: skill.querySelector('icon').textContent
            , relatedAttribute: attributeMap[skill.querySelector('keyability').textContent]
            , relatedClassIds: Object.values(ClassId).filter(classId => 
                !!Number(skill.querySelector(classId + '_class').textContent)) 
        }))
    }

    function getFeats() {
        function getFeatGrantsMap(feat) {
            const result = {}
            for (const classId of Object.values(ClassId)) {
                const granted = Number(feat.querySelector(classId + '_granted').textContent)
                if (granted !== -1) {
                    result[classId] = granted
                }
            }
            return result
        }

        function getFeatListsMap(feat) {
            const result = {}
            for (const classId of Object.values(ClassId)) {
                const list = Number(feat.querySelector(classId + '_list').textContent)
                if (!isNaN(list)) {
                    result[classId] = list
                }
            }
            return result
        }
        
        return Array.from(feats.firstChild.children).map((feat, index) => ({
            name: dialog.t(feat.querySelector('name').textContent)
            , description: dialog.t(feat.querySelector('description').textContent)
            , level: Number(feat.querySelector('mincharlevel').textContent) || 1
            , tier: Number(feat.querySelector('pips').textContent)
            , successor: Number(feat.querySelector('successor').textContent) || -1
            , prerequisites: [
                Number(feat.querySelector('prereqfeat1').textContent)
                , Number(feat.querySelector('prereqfeat2').textContent)
            ].filter(Number)
            , grants: getFeatGrantsMap(feat)
            , lists: getFeatListsMap(feat)
            , label: feat.querySelector('label').textContent
            , icon: feat.querySelector('icon').textContent
            , index
        }))
    }

    function getFeatGains() {
        const result = []
        Array.from(featGains.firstChild.children).forEach(featGain => {
            const level = {}
            for (const classId of Object.values(ClassId)) {
                level[classId] = Number(featGain.querySelector(classId + '_reg').textContent)
            }
            result.push(level)
        })
    
        return result
    }

    function getPowers() {
        return Array.from(powers.firstChild.children).map((power, index) => ({
            name: dialog.t(power.querySelector('name').textContent)
            , description: dialog.t(power.querySelector('spelldesc').textContent)
            , level: Number(power.querySelector('guardian').textContent)
            , prerequisites: power.querySelector('prerequisites').textContent.
                split('_').map(Number).filter(Number)
            , label: power.querySelector('label').textContent
            , icon: power.querySelector('iconresref').textContent
            , tier: Number(power.querySelector('pips').textContent)
            , index
        }))
    }

    function getPowerGains() {
        return Array.from(powerGains.firstChild.children).map(powerGain => ({
            [ClassId.JediGuardian]: Number(powerGain.querySelector(ClassId.JediGuardian).textContent)
            , [ClassId.JediSentinel]: Number(powerGain.querySelector(ClassId.JediSentinel).textContent)
            , [ClassId.JediConsular]: Number(powerGain.querySelector(ClassId.JediConsular).textContent)
        }))
    }

    function getClasses() {
        function getAttributesMap(node) {
            const attributes = ['str', 'con', 'dex', 'int', 'wis', 'cha']
                , result = {}
            for (const attribute of attributes) {
                result[attribute] = Number(node.querySelector(attribute).textContent)
            }
            return result
        }

        return Array.from(classes.firstChild.children).map(node => ({
            name: dialog.t(node.querySelector('name').textContent)
            , description: dialog.t(node.querySelector('description').textContent)
            , vitality: Number(node.querySelector('hitdie').textContent)
            , force: Number(node.querySelector('forcedie').textContent)
            , skillPoints: Number(node.querySelector('skillpointbase').textContent)
            , attributes: getAttributesMap(node)
            , id: node.querySelector('featstable').textContent.toLowerCase()
        }))
    }

    return {
        getSkills
        , getFeats
        , getFeatGains
        , getPowers
        , getPowerGains
        , getClasses
    }
})()