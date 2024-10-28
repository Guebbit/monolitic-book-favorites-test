import type { VNode, CSSProperties } from "vue";

export interface IEditableAttributes{
    classes?: string[]
    styles?: CSSProperties
}

export interface ILimitAttributes{
    tags?: string[]
    classNames?: string[]
}

/**
 * Utility function to edit slots and eventually add classes or other parameters to their elements
 *
 * @param slot
 * @param attributes
 * @param limitations
 */
export default (slot: (() => VNode[] | undefined) | undefined, attributes: IEditableAttributes = {}, limitations: ILimitAttributes = {}): VNode[] => {
    if(!slot)
        return [];
    const returnVNodesArray: VNode[] = [];
    const foundVNodesArray = slot() || [];
    for (let i = 0, len = foundVNodesArray.length; i < len; i++){
        const {
            classes = [],
            styles = {}
        } = attributes;
        const {
            tags: limitedTags = [],
            classNames: limitedClassNames = []
        } = limitations;

        if(
            foundVNodesArray[i] &&
            typeof foundVNodesArray[i].type === 'string' &&
            (limitedTags.length === 0 || limitedTags.includes(foundVNodesArray[i].type as string)) &&
            (limitedClassNames.length === 0 || limitedClassNames.includes(foundVNodesArray[i].props?.class || ""))
        )

        // if it's editable, change it
        if(
            foundVNodesArray[i] &&
            typeof foundVNodesArray[i].type === 'string' &&
            (limitedTags.length === 0 || limitedTags.includes(foundVNodesArray[i].type as string)) &&
            (limitedClassNames.length === 0 || limitedClassNames.includes(foundVNodesArray[i].props?.class || ""))
        )
            foundVNodesArray[i].props = {
                ...foundVNodesArray[i].props,
                class: [
                    foundVNodesArray[i].props?.class,
                    ...classes
                ].filter(Boolean).join(" "),
                style: {
                    ...foundVNodesArray[i].props?.style || {},
                    ...styles
                }
            }
        // either way, if a node exists, add it
        if(foundVNodesArray[i])
            returnVNodesArray.push(foundVNodesArray[i]);
    }
    return returnVNodesArray;
}