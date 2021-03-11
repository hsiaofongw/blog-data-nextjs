/// <reference types="next" />
/// <reference types="next/types/global" />

/// <reference types="next" />
/// <reference types="next/types/global" />

interface IPostExcerptData {
    name: string;
    file: string;
    date: string;
    description?: string;
    prettyPath?: string;
}

interface ILinkData {
    name: string;
    link: string;
    newTab: boolean;
    experimental?: boolean;
}

interface ICardData {
    title: string;
    description: string;
    avatar: string;
    link: string;
    addDate: string;
    dateVerified?: boolean;
    dateVerifiedBy?: string;
}

interface ICommentData {

    serialNumber: number;
    replyTo: number;
    email: string;
    nickName: string;
    website: string;
    content: string;
    date: number;

}

interface IBlogBasicMetaData {
    title: string;
    description: string;
    charSet: string;
    avatar?: string;
    menu: ILinkData[];
}
